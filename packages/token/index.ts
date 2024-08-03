import { TokenInterface, TokenKey } from './types.ts';

/**
 * Токен
 */
export class Token<Type = any> implements TokenInterface<Type> {
  readonly key: TokenKey<Type>;
  /**
   * @param name Уникальное название токена, например в формате URI
   */
  constructor(name: string) {
    this.key = Symbol.for(name) as TokenKey<Type>;
  }

  toString(): string {
    return this.key.description!;
  }

  isEqual(token: TokenInterface): boolean {
    return this.key === token.key;
  }
}
