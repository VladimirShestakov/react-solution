import type { ExtractTokensTypes, TokenInterface } from '../token/types';

/**
 * Реэкспорт типа на контейнер
 */
export type { Container } from './index.ts';

/**
 * Инъекция класса.
 * Указывается токен, конструктор и токены зависимости, которые будут переданы в первый аргумент конструктора
 */
export interface InjectClass<Type, ExtType extends Type, Deps> {
  token: TokenInterface<Type>,
  constructor: ConstructorWithDepends<ExtType, ExtractTokensTypes<Deps>>,
  depends: Deps,
  // Названия опциональных depends
  // optional?: keyof Deps,
  // Колбэк при удалении экземпляра из контейнера
  onFree?: (value: ExtType) => void | Promise<void>
}

/**
 * Инъекция функции, которая создаст значение сопоставимое с типом токена.
 * Указывается токен, функция и токены зависимости, которые будут переданы в первый аргумент функции
 * Функция может быть асинхронной.
 */
export interface InjectFabric<Type, ExtType extends Type, Deps> {
  token: TokenInterface<Type>,
  fabric: FunctionWithDepends<ExtType, ExtractTokensTypes<Deps>>,
  depends: Deps,
  // Названия опциональных depends
  // optional?: keyof Deps,
  // Колбэк при удалении созданного фабрикой значения из контейнера
  onFree?: (value: ExtType) => void | Promise<void>
}

/**
 * Инъекция значения сопоставимого с типом токена.
 */
export interface InjectValue<Type, ExtType extends Type> {
  token: TokenInterface<Type>,
  value: ExtType,
  // Колбэк при удалении созданного фабрикой значения из контейнера
  onFree?: (value: ExtType) => void | Promise<void>
}

export type Inject<Type = any, ExtType extends Type = any, Deps = any> = (
  | InjectClass<Type, ExtType, Deps>
  | InjectFabric<Type, ExtType, Deps>
  | InjectValue<Type, ExtType>
  );

export type Injected<Type = any, Deps = any, ExtType extends Type = any> =
  Inject<Type, ExtType, Deps>
  & {
  value?: ExtType;
};

/**
 * Конструктор, в первый аргумент которого передаются зависимости из DI
 */
export type ConstructorWithDepends<Type, Deps> = new (depends: Deps) => Type

/**
 * Функция, в первый аргумент которого передаются зависимости из DI.
 * Должна вернуть Type. Может быть асинхронной.
 */
export type FunctionWithDepends<Type, Deps> = (depends: Deps) => Type | Promise<Type>
