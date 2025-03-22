import { Token } from './token';

export type TokenKey<Type = any> = string & { _: Type };

/**
 * Интерфейс токена
 */
export interface TokenInterface<Type = any> {
  /**
   * Ключ токена, связанный с типом
   */
  readonly key: TokenKey<Type>;

  /**
   * Уникальное значение в строковом формате
   */
  toString(): string;

  /**
   * Сравнение токенов
   * @param token
   */
  isEqual(token: TokenInterface): boolean;

  /**
   * Проверка наличия атрибута
   * @param attribute Название атрибута
   */
  is(attribute: string): boolean;
}

/**
 * Тип, с которым ассоциирован токен
 */
export type ExtractTokenType<T> = T extends TokenInterface<infer Type> ? Type : unknown;

/**
 * Map типов из map токенов
 */
export type TypesFromTokens<T> = {
  [P in keyof T]: T[P] extends TokenInterface<infer Type> ? Type : undefined;
};

/**
 * Map токенов из map типов
 */
export type TokensFromTypes<T> = {
  [P in keyof T]: Token<P>;
};

/**
 * Карта токенов
 */
export type Tokens = Record<string, TokenInterface>;
