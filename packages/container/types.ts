import { Token, type TypesFromTokens, type TokenInterface } from '../token';

/**
 * Реэкспорт типа на контейнер
 */
export type { Container as ContainerType } from './container.ts';

interface InjectBase<Type, ExtType extends Type> {
  token: TokenInterface<Type>;
  merge?: boolean; // @todo Возможно нужно только для InjectValue
  // @todo Нужны ли в инъекции?
  onCreate?: (value: ExtType) => void | Promise<void>;
  onDelete?: (value: ExtType) => void | Promise<void>;
}

/**
 * Инъекция класса.
 * Указывается токен, конструктор и токены зависимости, которые будут переданы в первый аргумент конструктора
 */
export interface InjectClass<Type, ExtType extends Type, Deps> extends InjectBase<Type, ExtType> {
  constructor: ConstructorWithDepends<ExtType, TypesFromTokens<Deps>>;
  depends: Deps;
}

/**
 * Инъекция функции, которая создаст значение сопоставимое с типом токена.
 * Указывается токен, функция и токены зависимости, которые будут переданы в первый аргумент функции
 * Функция может быть асинхронной.
 */
export interface InjectFabric<Type, ExtType extends Type, Deps> extends InjectBase<Type, ExtType> {
  fabric: FunctionWithDepends<ExtType, TypesFromTokens<Deps>>;
  depends: Deps;
}

/**
 * Инъекция значения сопоставимого с типом токена.
 */
export interface InjectValue<Type, ExtType extends Type> extends InjectBase<Type, ExtType> {
  value: ExtType;
}

export type Inject<Type = any, ExtType extends Type = any, Deps = any> =
  | InjectClass<Type, ExtType, Deps>
  | InjectFabric<Type, ExtType, Deps>
  | InjectValue<Type, ExtType>;

export type InjectArray = Inject[] | InjectArray[];

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
