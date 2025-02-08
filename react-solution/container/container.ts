import { Events } from '../events';
import { WaitingStore, type TWaitKey, WaitStatus } from '../waiting-store';
import mc from 'merge-change';
import { isClassProvider, isFactoryProvider, isValueProvider } from './utils';
import {
  type ContainerEvents,
  type Provider,
  Providers,
  ClassProvider,
  FactoryProvider,
  ValueProvider,
} from './types';
import { type TokenInterface, type TypesFromTokens, type TokenKey, newToken } from '../token';

/**
 * Токен на DI контейнер
 */
export const CONTAINER = newToken<Container>('@react-solution/container');

/**
 * DI контейнер предназначен для управления зависимостями.
 * В контейнере регистрируются зависимости всех программных решений приложения: модулей, компонентов, сервисов, ресурсов — любых объектов.
 * Через контейнер предоставляется доступ ко всем программным решениям приложения.
 * Контейнер берёт на себя обязанность создавать и инициализировать решение по первому требованию.
 * Контейнер запоминает подготовленное решение, чтобы не создавать и не инициализировать его повторно при
 * очередном запросе. Контейнер реализует паттерн "Одиночка".
 */
export class Container {
  /**
   * События контейнера.
   *
   * Контейнер отправляет события о создании экземпляра решения onCreate и его удалении `onDelete` (когда вызывается `deleteInstance()`).
   * На эти события можно подписаться.
   *
   * @example
   * ```ts
   * container.events.on('onCreate', <Type extends object>({ token, value }: { token: Token<Type>; value: Type }) => {
   *   // обработка события
   * }
   * ```
   *
   * ```ts
   * container.events.on('onDelete', ({ token }: { token: Token }) => {
   *   // обработка события
   * }
   * ```
   *
   * Например, сервис `dump` отслеживает событие `onCreate`, чтобы всем инициализируемым программным
   * решениям сразу передавать их сохраненное состояние (состояние сохраняется после рендере на сервере).
   *
   * Для работы с событиями используется класс `Events` из React-Solution.
   * Для отписки от события применяется метод `events.off()`. Подробнее см. в описании класса `Events`.
   */
  readonly events: Events<ContainerEvents> = new Events();
  /**
   * Все зарегистрированные провайдеры
   * Через провайдеры устанавливаются конкретные зависимости и логика их создания
   */
  protected providers: Map<TokenKey, Provider[]> = new Map();
  /**
   * Ожидания на выборку (на создание) экземпляра. В ожидании будет храниться и созданный экземпляр.
   */
  protected waiting: WaitingStore = new WaitingStore();

  constructor() {
    // Регистрация самого себя
    this.register({ token: CONTAINER, value: this });
  }

  /**
   * @hidden
   */
  register<Type, ExtType extends Type, Deps>(provider: FactoryProvider<Type, ExtType, Deps>): this;
  /**
   * @hidden
   */
  register<Type, ExtType extends Type, Deps>(provider: ClassProvider<Type, ExtType, Deps>): this;
  /**
   * @hidden
   */
  register<Type, ExtType extends Type>(provider: ValueProvider<Type, ExtType>): this;
  /**
   * @hidden
   */
  register(provider: Providers): this;

  /**
   * Регистрация зависимостей через установку провайдера в контейнер
   * @param provider Провайдер или массив провайдеров
   */
  register<Type, ExtType extends Type, Deps>(provider: Providers | Provider<Type, ExtType, Deps>): this {
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
   * Выбор "решения" по токену.
   * Если решение ещё не создано, то будет создано и инициализировано.
   * Если решение ещё в процессе создания, то вернётся уже существующий promise, чтобы не дублировалось создание.
   * Иначе возвращается ранее созданное решение.
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
   * Исполнение провайдера для подготовки "решения"
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
      let nextValue;
      switch (true) {
        case isValueProvider(provider): {
          nextValue = provider.value;
          break;
        }
        case isFactoryProvider(provider): {
          nextValue = await provider.factory(await this.getMapped(provider.depends));
          break;
        }
        case isClassProvider(provider): {
          nextValue = new provider.constructor(await this.getMapped(provider.depends));
          break;
        }
        default:
          throw Error(`Provider by token "${token}" is wrong`);
      }
      value = provider.merge ? mc.update(value, nextValue) : nextValue;
    }

    await this.events.emit('onCreate', { token, value });

    return value;
  }

  /**
   * Выбор множества сервисов по указанной карте токенов.
   * Сервисы будут возвращены под теми же ключами, под которыми указаны токены в depends.
   * @param depends Карта токенов.
   */
  async getMapped<Deps extends Record<string, TokenInterface>>(
    depends: Deps,
  ): Promise<TypesFromTokens<Deps>> {
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

    return result as TypesFromTokens<Deps>;
  }

  /**
   * Выбор сервиса с логикой ожидания для <Suspense> (с приостановкой через выброс исключения)
   * Если сервис ещё не создан, то запоминается обещание (promise) его создания
   * Если ожидание ещё не завершено, то в исключение кидается обещание создания сервиса
   * Если ожидание выполнено, то возвращается результат обещания - экземпляр сервиса
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
   * Выбор множества сервисов по карте токенов с логикой ожиданием для <Suspense>
   * Сервисы будут возвращены под теми же свойствами, под которыми указаны их токены в depends.
   * Исключение кидается пока не будут выполнены асинхронные выборки всех сервисов.
   * В исключение кидается последние невыполненное обещание, чтобы попытаться все сервисы выбрать за раз.
   * @param depends Карта токенов.
   */
  getMappedWithSuspense<Deps extends Record<string, TokenInterface>>(
    depends: Deps,
  ): TypesFromTokens<Deps> {
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

    return result as TypesFromTokens<Deps>;
  }

  /**
   * Удаление экземпляра программного решения в DI контейнере.
   * После чего при выборке этого же решения из DI контейнера оно снова будет создаваться и инициироваться.
   *
   * @param token
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
