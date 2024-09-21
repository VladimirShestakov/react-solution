/**
 * Проверка на Promise
 * @param promise
 */
export function isPromise<T>(promise: Promise<T> | unknown): promise is Promise<T> {
  if (!!promise && (typeof promise === 'object' || typeof promise === 'function')) {
    return typeof (promise as Promise<T>).then === 'function';
  }
  return false;
}
