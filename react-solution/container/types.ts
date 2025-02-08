import { Token, type TypesFromTokens, type TokenInterface } from '../token';

/**
 * Тип базового провайдера
 */
interface BaseProvider<Type, ExtType extends Type> {
  token: TokenInterface<Type>;
  merge?: boolean;
  onDelete?: (value: ExtType) => void | Promise<void>;
}

/**
 * Провайдер с классом, экземпляры которого нужно создавать.
 * Содержит токен, конструктор, токены зависимостей (которые будут переданы в первый аргумент конструктора)
 */
export interface ClassProvider<Type, ExtType extends Type, Deps> extends BaseProvider<Type, ExtType> {
  constructor: ConstructorWithDepends<ExtType, TypesFromTokens<Deps>>;
  depends: Deps;
}

/**
 * Провайдер с функцией, которая создаёт значение сопоставимое с типом токена.
 * Содержит токен, функцию и токены зависимостей, которые будут переданы в первый аргумент функции
 * Функция может быть асинхронной.
 */
export interface FactoryProvider<Type, ExtType extends Type, Deps> extends BaseProvider<Type, ExtType> {
  factory: FunctionWithDepends<ExtType, TypesFromTokens<Deps>>;
  depends: Deps;
}

/**
 * Провайдер значения сопоставимого с типом токена.
 */
export interface ValueProvider<Type, ExtType extends Type> extends BaseProvider<Type, ExtType> {
  value: ExtType;
}

export type Provider<Type = any, ExtType extends Type = any, Deps = any> =
  | ClassProvider<Type, ExtType, Deps>
  | FactoryProvider<Type, ExtType, Deps>
  | ValueProvider<Type, ExtType>;

/**
 * Массив провайдеров любой вложенностью
 */
export type Providers = Provider[] | Providers[];

/**
 * Конструктор, в первый аргумент которого передаются зависимости из DI
 */
export type ConstructorWithDepends<Type, Deps> = new (depends: Deps) => Type;

/**
 * Функция, в первый аргумент которого передаются зависимости из DI.
 * Должна вернуть Type. Может быть асинхронной.
 */
export type FunctionWithDepends<Type, Deps> = (depends: Deps) => Type | Promise<Type>;

export type ContainerEvents = {
  onCreate: {
    token: Token<any>;
    value: any;
  };
  onDelete: {
    token: Token<any>;
  };
};
