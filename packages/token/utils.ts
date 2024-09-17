import { Token } from './index.ts';
import { TokenDecorator } from './decorator.ts';
import type { TokenInterface } from './types.ts';

/**
 * Создание токена.
 * Обязательно указать тип Type, с которым ассоциируется токен.
 * ```ts
 *   const SIMPLE_TOKEN = newToken<TSimple>('@project-name/simple');
 * ```
 * @param name Уникальное название токена, например в формате URI
 */
export function newToken<Type>(name: string): Token<Type> {
  return new Token<Type>(name);
}

/**
 * Декорирование токена в опциональный
 * @param token
 */
export function optionalToken<Type>(token: TokenInterface<Type>): TokenDecorator<Type | undefined> {
  return new TokenDecorator(token, { optional: true });
}

export function arrayToken<Type>(token: TokenInterface<Type>): TokenDecorator<Type[]> {
  return new TokenDecorator(token as TokenInterface<Type[]>, { array: true });
}

/**
 * Проверка принадлежности к типу TokenInterface
 * @param value
 */
export function isToken<Type>(
  value: TokenInterface<Type> | unknown
): value is TokenInterface<Type> {
  return Boolean(value
    && typeof value === 'object'
    && 'key' in value
    && typeof value.key === 'string'
  );
}

export function isTokenDecorator<Type>(
  value: TokenDecorator<Type> | unknown
): value is TokenDecorator<Type> {
  return value instanceof TokenDecorator;
}
