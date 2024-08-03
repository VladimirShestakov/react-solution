import { TokenInterface, TokenKey } from './types.ts';

/**
 * Декоратор опционального токена
 */
export class OptionalToken<Type = any> implements TokenInterface<Type> {
  readonly isOptional: boolean = true;

  constructor(protected token: TokenInterface<Type>) {}

  get key(): TokenKey<Type> {
    return this.token.key;
  }

  toString(): string {
    return this.token.toString();
  }

  isEqual(token: TokenInterface): boolean {
    return this.token.isEqual(token);
  }
}
