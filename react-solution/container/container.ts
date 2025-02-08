import { Events } from '../events';
import { WaitingStore, type TWaitKey, WaitStatus } from '../waiting-store';
import mc from 'merge-change';
import { isInjectClass, isInjectFactory, isInjectValue } from './utils';
import {
  type ContainerEvents,
  type Inject,
  InjectArray,
  InjectClass,
  InjectFactory,
  InjectValue,
} from './types';
import { type TokenInterface, type TypesFromTokens, type TokenKey, newToken } from '../token';

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
   * Контейнер отправляет события о создании экземпляра решения onCreate и его удалении `onDelete` (когда вызывается `deleteValue()`).
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
   * Все регистрации зависимостей
   */
  protected injects: Map<TokenKey, Inject[]> = new Map();
  /**
   * Ожидания на выборку (на создание) экземпляра. В ожидании будет храниться и созданный экземпляр.
   */
  protected waiting: WaitingStore = new WaitingStore();

  constructor() {
    // Инъекция самого себя
    this.set({ token: CONTAINER, value: this });
  }

  /**
   * @hidden
   */
  set<Type, ExtType extends Type, Deps>(inject: InjectFactory<Type, ExtType, Deps>): this;
  /**
   * @hidden
   */
  set<Type, ExtType extends Type, Deps>(inject: InjectClass<Type, ExtType, Deps>): this;
  /**
   * @hidden
   */
  set<Type, ExtType extends Type>(inject: InjectValue<Type, ExtType>): this;
  /**
   * @hidden
   */
  set(inject: InjectArray): this;

  /**
   * Регистрация зависимостей
   * @param inject Регистрация одного из типов InjectFactory, InjectClass, InjectValue. Или массив регистраций
   */
  set<Type, ExtType extends Type, Deps>(inject: InjectArray | Inject<Type, ExtType, Deps>): this {
    if (!Array.isArray(inject)) {
      inject = [inject];
    }
    inject.forEach(item => {
      if (Array.isArray(item)) {
        this.set(item);
      } else {
        if (this.injects.has(item.token.key)) {
          this.injects.get(item.token.key)?.push({ ...item });
        } else {
          this.injects.set(item.token.key, [{ ...item }]);
        }
      }
    });

    return this;
  }

  /**
   * @hidden
   */
  setValue<Type, ExtType extends Type>(inject: InjectValue<Type, ExtType>): this {
    return this.set(inject);
  }

  /**
   * @hidden
   */
  setFactory<Type, ExtType extends Type, Deps>(inject: InjectFactory<Type, ExtType, Deps>): this {
    return this.set(inject);
  }

  /**
   * @hidden
   */
  setClass<Type, ExtType extends Type, Deps>(inject: InjectClass<Type, ExtType, Deps>): this {
    return this.set(inject);
  }

  /**
   * Выбор сервиса по токену.
   * Если сервиса ещё не создан, то будет создан и инициализирован.
   * Если сервиса ещё в процессе создания, то вернётся уже существующий promise, чтобы не дублировалось создание.
   * Иначе возвращается ранее созданный сервиса.
   * @param token
   */
  async get<Type>(token: TokenInterface<Type>): Promise<Type> {
    // Экземпляра нет и ранее не было попытки выбора
    if (!this.waiting.has(token.key)) {
      // Запоминаем promise создания экземпляра
      this.waiting.add(token.key, this.createValue(token));
    }
    // Возвращаем promise создания экземпляра
    return this.waiting.getPromise(token.key);
  }

  /**
   * Статус ожидания
   * @param token
   */
  getStatus<Type>(token: TokenInterface<Type>): WaitStatus {
    return this.waiting.getStatus(token.key);
  }

  /**
   * Создание экземпляра (значения).
   * @param token Токен, по которому будет найдена инъекция и создан экземпляр
   * @protected
   */
  protected async createValue<Type>(token: TokenInterface<Type>): Promise<Type> {
    const injects = this.injects.get(token.key);
    if (!injects || injects.length === 0) {
      if (token.is('optional')) {
        return undefined as Type;
      } else {
        throw Error(`Injection by token "${token}" not found`);
      }
    }

    let value = undefined;
    // Создание экземпляра
    for (const inject of injects) {
      let nextValue;
      switch (true) {
        case isInjectValue(inject): {
          nextValue = inject.value;
          break;
        }
        case isInjectFactory(inject): {
          nextValue = await inject.factory(await this.getMapped(inject.depends));
          break;
        }
        case isInjectClass(inject): {
          nextValue = new inject.constructor(await this.getMapped(inject.depends));
          break;
        }
        default:
          throw Error(`Injection by token "${token}" is wrong`);
      }
      value = inject.merge ? mc.update(value, nextValue) : nextValue;
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
      this.waiting.add(token.key, this.createValue(token));
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
  async deleteValue<Type>(token: TokenInterface<Type>): Promise<void> {
    const injects = this.injects.get(token.key) ?? [];
    for (const inject of injects) {
      const onDelete = inject.onDelete;
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

  // async ready() {
  //   await this.events.emit('onReady');
  //   return this;
  // }
  //
  // async finish() {
  //   for (const token of this.injects.keys()) {
  //     await this.deleteValue(token);
  //   }
  //   await this.events.emit('onFinish');
  //   return this;
  // }
}
