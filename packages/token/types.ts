export type TokenKey<Type = any> = symbol & { _: Type };

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
  isEqual(token: TokenInterface): boolean
}

/**
 * Тип, с которым ассоциирован токен
 */
export type ExtractTokenType<T> = T extends TokenInterface<infer Type> ? Type : unknown;

/**
 * Map типов из map токенов
 */
export type ExtractTokensTypes<T> = {
  [P in keyof T]: T[P] extends TokenInterface<infer Type> ? Type : undefined;
};
