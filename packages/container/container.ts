import { Events } from '../../packages/events';
import { WaitingStore, type TWaitKey, WaitStatus } from '../../packages/waiting-store';
import mc from 'merge-change';
import { CONTAINER } from './token.ts';
import { isInjectClass, isInjectFabric, isInjectValue } from './utils.ts';
import { type ContainerEvents, type Inject } from './types';
import { type TokenInterface, type TypesFromTokens, type TokenKey } from '../../packages/token';

export class Container {
  readonly events: Events<ContainerEvents> = new Events();
  // Инъекции с информацией как создавать экземпляры сервисов (значения)
  protected injects: Map<TokenKey, Inject[]> = new Map();
  // Ожидания на выборку (создание) сервисов. В ожиданиях хранятся и сами экземпляры (значения)
  protected waiting: WaitingStore = new WaitingStore();

  constructor() {
    // Инъекция самого себя
    this.set({ token: CONTAINER, value: this });
  }

  /**
   * Инъекция сервиса
   * @param inject Инъекция в виде конструктора, функции или значения
   */
  set<Type, ExtType extends Type, Deps>(inject: Inject<Type, ExtType, Deps> | Inject[]): this {
    if (!Array.isArray(inject)) inject = [inject];
    inject.forEach(item => {
      if (this.injects.has(item.token.key)) {
        this.injects.get(item.token.key)?.push({ ...item });
      } else {
        this.injects.set(item.token.key, [{ ...item }]);
      }
    });

    return this;
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
   * Статус сервиса
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
        case isInjectFabric(inject): {
          nextValue = await inject.fabric(await this.getMapped(inject.depends));
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
  async getMapped<Deps extends Record<string, TokenInterface>>(depends: Deps): Promise<TypesFromTokens<Deps>> {
    // Выбор зависимостей из контейнера
    const result: Record<string, any> = {};
    const keys = Object.keys(depends);
    const promises = [];
    for (const key of keys) {
      promises.push(this.get(depends[key]).then(value => {
        result[key] = value;
        return value;
      }));
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
      // Запоминаем promise создания экземпляра
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
  getMappedWithSuspense<Deps extends Record<string, TokenInterface>>(depends: Deps): TypesFromTokens<Deps> {
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
   * Удаление ранее созданного экземпляра сервиса.
   * Удаляется обещание создания сервиса, где и хранится результат создания
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

  getInstances() {
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
