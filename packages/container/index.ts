import { isOptionalToken } from '../token/utils.ts';
import { WaitingStore } from '../waiting-store';
import { CONTAINER } from './token.ts';
import { isInjectClass, isInjectFabric, isInjectValue } from './utils.ts';
import type { Inject, Injected } from './types';
import type { TokenInterface, ExtractTokensTypes, TokenKey } from '../token/types.ts';

export class Container {
  protected injects: Map<TokenKey, Injected> = new Map();
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
    inject.forEach(item => this.injects.set(item.token.key, { ...item }));

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
   * Создание экземпляра (значения).
   * @param token Токен, по которому будет найдена инъекция и создан экземпляр
   * @protected
   */
  protected async createValue<Type>(token: TokenInterface<Type>): Promise<Type> {
    const injected = this.injects.get(token.key);
    if (!injected) {
      if (isOptionalToken(token)) {
        return undefined as Type;
      } else {
        throw Error(`Injection by token "${token}" not found`);
      }
    }

    // Создание экземпляра
    const inject = injected;
    switch (true) {
      case isInjectValue(inject): {
        return injected.value;
      }
      case isInjectFabric(inject): {
        injected.value = (await inject.fabric(await this.getMapped(inject.depends)));
        return injected.value;
      }
      case isInjectClass(inject): {
        injected.value = new inject.constructor(await this.getMapped(inject.depends));
        return injected.value;
      }
      default:
        throw Error(`Injection by token "${token}" is wrong`);
    }
  }

  /**
   * Выбор множества сервисов по указанной карте токенов.
   * Сервисы будут возвращены под теми же ключами, под которыми указаны токены в depends.
   * @param depends Карта токенов.
   */
  async getMapped<Deps extends Record<string, TokenInterface>>(depends: Deps): Promise<ExtractTokensTypes<Deps>> {
    // Выбор зависимостей из контейнера
    const result: Record<string, any> = {};
    const keys = Object.keys(depends);
    for (const key of keys) {
      result[key] = await this.get(depends[key]);
    }

    return result as ExtractTokensTypes<Deps>;
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
    // Если исключения не выкинуты, значит ожидание выполнено
    return this.waiting.getResult<Type>(token.key);
  }

  /**
   * Выбор множества сервисов по карте токенов с логикой ожиданием для <Suspense>
   * Сервисы будут возвращены под теми же свойствами, под которыми указаны их токены в depends.
   * Исключение кидается пока не будут выполнены асинхронные выборки всех сервисов.
   * В исключение кидается последние невыполненное обещание, чтобы попытаться все сервисы выбрать за раз.
   * @param depends Карта токенов.
   */
  getMappedWithSuspense<Deps extends Record<string, TokenInterface>>(depends: Deps): ExtractTokensTypes<Deps> {
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

    return result as ExtractTokensTypes<Deps>;
  }

  /**
   * Удаление ранее созданного экземпляра сервиса
   * @param token
   */
  async free<Type>(token: TokenInterface<Type>): Promise<void> {
    const injected = this.injects.get(token.key);
    if (injected && 'value' in injected) {
      const entity = injected.value;
      delete injected.value;
      const onFree = injected.onFree;
      if (onFree) await onFree(entity);
    }
  }

  entries() {
    return this.injects.entries();
  }
}
