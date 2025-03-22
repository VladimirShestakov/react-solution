import type { TokenInterface, TokenKey } from './types';

/**
 * Токен
 * @typeParam Type Тип токена
 */
export class Token<Type = unknown> implements TokenInterface<Type> {
  readonly key: TokenKey<Type>;
  /**
   * @param name Уникальное название токена, например в формате URI
   */
  constructor(name: string) {
    this.key = name as TokenKey<Type>;
  }

  toString(): string {
    return this.key;
  }

  isEqual(token: TokenInterface): boolean {
    return this.key === token.key;
  }

  is(): boolean {
    return false;
  }
}
