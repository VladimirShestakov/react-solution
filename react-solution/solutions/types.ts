import { Token, type TypesFromTokens, type TokenInterface } from '../token';

/**
 * Массив провайдеров любой вложенности
 */
export type Providers = Provider[] | Providers[];

/**
 * Провайдер с функцией, которая создаёт программное решение сопоставимое с типом токена.
 */
export interface Provider<Type = any, ExtType extends Type = any, DepsTokens = any>
  extends ProviderProps<Type, ExtType> {
  /**
   * Функция для подготовки решения и его возврата.
   * Тип возвращаемого значения должен совпадать с типом в токене.
   * Может быть асинхронной (возвращать промис)
   * В первый аргумент (в виде plain объекта) получает все зависимые решения, чьи токены указаны в depends
   */
  factory: FunctionWithDepends<ExtType, TypesFromTokens<DepsTokens>>;
  /**
   * Токены зависимых решений в виде пар "название: токен".
   * Названия должны совпадать с названиями свойств первого аргумента функции factory
   */
  depends: DepsTokens;
}

/**
 * Основные свойства провайдера.
 * Используется для создания кастомных провайдеров (чтобы передать все свойства в итоговый Provider)
 */
export interface ProviderProps<Type, ExtType extends Type> {
  /**
   * Токен на предоставляемое решение (ключ, связанный с типом решения)
   */
  token: TokenInterface<Type>;
  /**
   * Признак для слияния предоставленного решение (значения) с уже внедренным в DI контейнер
   */
  merge?: boolean;
  /**
   * Функция обратного вызова при удалении подготовленного решение (не провайдера) из DI контейнера
   * @param value
   */
  onDelete?: (value: ExtType) => void | Promise<void>;
}

/**
 * Параметры для создания провайдера на основе конструктора класса
 */
export interface ClassProvider<Type, ExtType extends Type, DepsTokens>
  extends ProviderProps<Type, ExtType> {
  constructor: ConstructorWithDepends<ExtType, TypesFromTokens<DepsTokens>>;
  depends: DepsTokens;
}

/**
 * Параметры для создания провайдера на основе предопределенного значения.
 */
export interface ValueProvider<Type, ExtType extends Type> extends ProviderProps<Type, ExtType> {
  value: ExtType;
}

/**
 * Карта зависимостей (программных решений)
 */
export type Depends = Record<string, any>;

/**
 * Функция для подготовки решения с использованием зависимостей из DI.
 * Может быть асинхронной (возвращать промис)
 * В первый аргумент depends (в виде plain объекта) передаются зависимые решения
 */
export type FunctionWithDepends<Type, Deps extends Depends> = (
  depends: Deps,
) => Type | Promise<Type>;

/**
 * Конструктор, в первый аргумент которого передаются зависимости из DI
 */
export type ConstructorWithDepends<Type, Deps extends Depends> = new (depends: Deps) => Type;

/**
 * События DI контейнера
 */
export type SolutionsEvents = {
  /**
   * Событие при создании программного решения (после успешного выполнения провайдера, но перед возвратом решения)
   */
  onCreate: {
    token: Token<any>;
    value: any;
  };
  /**
   * События при сбросе программного решения из контейнера
   * Можно использовать для деструктуризации решения - освобождения ресурсов.
   */
  onDelete: {
    token: Token<any>;
  };
};
