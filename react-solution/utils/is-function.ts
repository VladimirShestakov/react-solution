/**
 * Проверка на Function
 * @param f
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(f: Function | unknown): f is Function {
  return !!f && typeof f === 'function';
}
