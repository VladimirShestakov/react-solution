import { Token } from './index.ts';
import { OptionalToken } from './optional.ts';
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
export function optionalToken<Type>(token:Token<Type>): OptionalToken<Type | undefined> {
  return new OptionalToken(token);
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
    && typeof value.key === 'symbol'
  );
}

/**
 * Проверка принадлежности к типу OptionalToken
 * @param value
 */
export function isOptionalToken<Type>(
  value: OptionalToken<Type> | unknown
): value is OptionalToken<Type> {
  return isToken(value) && Boolean('isOptional' in value && value.isOptional);
}

