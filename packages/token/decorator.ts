import type { TokenInterface, TokenKey } from './types.ts';

/**
 * Декоратор токена
 */
export class TokenDecorator<Type = any> implements TokenInterface<Type> {
  constructor(
    protected token: TokenInterface<Type>,
    protected attributes: Record<string, boolean>,
  ) {}

  get key(): TokenKey<Type> {
    return this.token.key;
  }

  toString(): string {
    return this.token.toString();
  }

  isEqual(token: TokenInterface): boolean {
    return this.token.isEqual(token);
  }

  is(attribute: string): boolean {
    if (attribute in this.attributes) return this.attributes[attribute];
    return this.token.is(attribute);
  }
}
