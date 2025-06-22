import { Events } from '../events';
import { WaitingStore, type TWaitKey, WaitStatus } from '../waiting-store';
import mc from 'merge-change';
import { valueProvider } from './utils';
import { SolutionsEvents, Provider, Providers } from './types';
import {
  type TokenInterface,
  type TypesFromTokens,
  type TokenKey,
  newToken,
  Tokens,
} from '../token';

/**
 * Токен на DI контейнер
 */
export const SOLUTIONS = newToken<Solutions>('@react-solution/solutions');

/**
 * DI контейнер для управления программными решениями и их зависимостями.
 */
export class Solutions {
  /**
   * События контейнера.
   */
  readonly events: Events<SolutionsEvents> = new Events();
  /**
   * Все зарегистрированные провайдеры
   * Через провайдеры устанавливаются конкретные зависимости и логика их создания
   */
  protected providers: Map<TokenKey, Provider[]> = new Map();
  /**
   * Ожидания на выборку (на создание) экземпляра. В ожидании будет храниться и созданный экземпляр.
   */
  protected waiting: WaitingStore = new WaitingStore();

  /**
   * Создание экземпляра DI контейнера.
   * @param providers Массив провайдеров
   * @return Пустой экземпляр DI контейнера.
   */
  constructor(providers?: Providers) {
    // Регистрация самого себя
    this.register(valueProvider({ token: SOLUTIONS, value: this }));
    if (providers) {
      this.register(providers);
    }
  }

  /**
   * Регистрация провайдера программного решения
   * В метод `register()` передаётся провайдер решения одного из типов `FactoryProvider`, `ClassProvider`, `ValueProvider`. Или массив провайдеров.
   * @param provider Провайдер или массив провайдеров
   */
  register<Type, ExtType extends Type, DepsType>(
    provider: Providers | Provider<Type, ExtType, DepsType>,
  ): this {
    if (!Array.isArray(provider)) {
      provider = [provider];
    }
    provider.forEach(item => {
      if (Array.isArray(item)) {
        this.register(item);
      } else {
        if (this.providers.has(item.token.key)) {
          this.providers.get(item.token.key)?.push({ ...item });
        } else {
          this.providers.set(item.token.key, [{ ...item }]);
        }
      }
    });

    return this;
  }

  /**
   * Выбор программного решения по токену.
   * Если решение ещё не создано, то будет создано и инициализировано.
   * Если решение ещё в процессе создания, то вернётся уже существующий promise, чтобы не дублировалось создание.
   * Иначе возвращается ранее созданное решение.
   * Решение создаётся с помощью зарегистрированного провайдера.
   * Если провайдера нет, то выбросится исключение.
   *
   * @param token
   */
  async get<Type>(token: TokenInterface<Type>): Promise<Type> {
    // Экземпляра нет и ранее не было попытки выбора
    if (!this.waiting.has(token.key)) {
      // Запоминаем promise создания экземпляра
      this.waiting.add(token.key, this.resolve(token));
    }
    // Возвращаем promise создания экземпляра
    return this.waiting.getPromise(token.key);
  }

  /**
   * Статус ожидания решения
   * @param token
   */
  getStatus<Type>(token: TokenInterface<Type>): WaitStatus {
    return this.waiting.getStatus(token.key);
  }

  /**
   * Исполнение провайдера для подготовки программного решения.
   * @param token Токен, по которому будет найден провайдер, исполнен и получено решение
   * @protected
   */
  protected async resolve<Type>(token: TokenInterface<Type>): Promise<Type> {
    const providers = this.providers.get(token.key);
    if (!providers || providers.length === 0) {
      if (token.is('optional')) {
        return undefined as Type;
      } else {
        throw Error(`Provider by token "${token}" not found`);
      }
    }

    let value = undefined;
    // Создание экземпляра
    for (const provider of providers) {
      const nextValue = await provider.factory(await this.getMapped(provider.depends));
      value = provider.merge ? mc.update(value, nextValue) : nextValue;
    }

    await this.events.emit('onCreate', { token, value });

    return value;
  }

  /**
   * Выбор множества программных решений по карте токенов.
   * Программные решения будут возвращены под теми же ключами, под которыми указаны токены в depends.
   * @param depends Карта токенов.
   */
  async getMapped<DepsType extends Tokens>(depends: DepsType): Promise<TypesFromTokens<DepsType>> {
    // Выбор зависимостей из контейнера
    const result: Record<string, any> = {};
    const keys = Object.keys(depends);
    const promises = [];
    for (const key of keys) {
      promises.push(
        this.get(depends[key]).then(value => {
          result[key] = value;
          return value;
        }),
      );
    }
    await Promise.all(promises);

    return result as TypesFromTokens<DepsType>;
  }

  /**
   * Выбор программного решения с логикой ожидания для `<Suspense>` (с приостановкой через выброс исключения).
   * Если программное решение ещё не создано, то запоминается обещание (promise) на его создание.
   * Если ожидание ещё не завершено, то в исключение кидается обещание (promise) на создание решения.
   * Если ожидание выполнено, то возвращается результат обещания - экземпляр программного решения.
   * @param token
   */
  getWithSuspense<Type>(token: TokenInterface<Type>): Type {
    if (!this.waiting.has(token.key)) {
      // Если экземпляра ещё нет, то запоминаем promise создания/выборки экземпляра
      this.waiting.add(token.key, this.resolve(token));
    }
    // Кидаем promise, если ещё в ожидании
    if (this.waiting.isWaiting(token.key)) throw this.waiting.getPromise(token.key);
    // Кидаем ошибку, если что-то пошло не так
    if (this.waiting.isError(token.key)) throw this.waiting.getError(token.key);
    // Если исключения не выкинуты, значит обещание выполнено, возвращаем его результат
    return this.waiting.getResult(token.key);
  }

  /**
   * Выбор множества программных решений по карте токенов с логикой ожиданием для `<Suspense>`.
   * Программные решения будут возвращены под теми же ключами, под которыми указаны их токены в depends.
   * Исключение кидается пока не будут выполнены асинхронные провайдеры всех решений.
   * В исключение кидается последние невыполненное обещание, чтобы попытаться все программные решения выбрать за раз.
   * @param depends Карта токенов.
   */
  getMappedWithSuspense<DepsType extends Tokens>(depends: DepsType): TypesFromTokens<DepsType> {
    let exception;
    // Выбор зависимостей из контейнера
    const result: Record<string, any> = {};
    const keys = Object.keys(depends);
    for (const key of keys) {
      try {
        result[key] = this.getWithSuspense(depends[key]);
      } catch (e) {
        exception = e;
      }
    }
    if (exception) throw exception;

    return result as TypesFromTokens<DepsType>;
  }

  /**
   * Сброс созданного программного решения из DI контейнера.
   * Провайдер решения остаётся зарегистрированным.
   * При последующей выборке сброшенного решения оно снова будет создано - снова исполнится провайдер решения.
   *
   * @param token Токен сбрасываемого решения
   * @typeParam [Type] Тип в токене
   * @todo Проработать кейсы применения.
   */
  async deleteInstance<Type>(token: TokenInterface<Type>): Promise<void> {
    const providers = this.providers.get(token.key) ?? [];
    for (const provider of providers) {
      const onDelete = provider.onDelete;
      const isSuccess = this.waiting.isSuccess(token.key);
      const value = this.waiting.getResult(token.key);
      this.waiting.delete(token.key);
      // Асинхронный колбэк выполняем уже после удаления значения из хранилища ожиданий.
      // Чтобы не получилось выборки удаляемого значения.
      if (isSuccess && onDelete) await onDelete(value);
      if (isSuccess) await this.events.emit('onDelete', { token });
    }
  }

  /**
   * @hidden
   */
  getInstances(): Array<[string, object]> {
    const instances: Array<[TWaitKey, any]> = [];
    for (const [key, wait] of this.waiting.entries()) {
      if (!wait.waiting && !wait.error) {
        instances.push([key, wait.result]);
      }
    }
    return instances;
  }
}
