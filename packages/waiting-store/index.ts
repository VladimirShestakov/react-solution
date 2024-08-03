import isPromise from '../utils/is-promise.ts';
import { TWaitKey, TWaitRecord, TWaitState } from './types';

/**
 * Хранилище ожиданий.
 */
export class WaitingStore {
  private state: TWaitState = new Map();

  /**
   * Наличие ожидание по ключу
   * @param key
   */
  has(key: TWaitKey): boolean {
    return this.state.has(key);
  }

  /**
   * Создание ожидания
   * @param key
   * @param promise Обещания, выполнение которого будет ожидаться
   */
  add<P extends Promise<unknown>>(key: TWaitKey, promise: P) {
    const _isPromise = isPromise(promise);
    this.state.set(key, {
      waiting: _isPromise,
      // При завершении промиса будет сброс признака waiting
      promise: _isPromise
        ? promise.then((result) => this.complete(key, {result})).catch(error => this.complete(key, {error}))
        : undefined,
    });
  }

  /**
   * Завершение ожидания
   * Информация про ожидание остаётся, чтобы помнить про его завершенность
   * @param key
   * @param result Результат обещания
   * @param error Ошибка обещания
   */
  complete<R>(key: TWaitKey, {result, error}: {result?: R, error?: Error}): void {
    if (this.has(key)) {
      // Мутируем
      const item = this.state.get(key) as TWaitRecord;
      item.waiting = false;
      item.result = result;
      item.error = error;
    } else {
      this.state.set(key, {waiting: false, result, error});
    }
  }

  /**
   * Удаление ожидания
   * @param key
   */
  delete(key: TWaitKey) {
    this.state.delete(key);
  }

  // /**
  //  * Выброс исключения, если ожидание ещё не завершено
  //  * Исключением будет promise, чтобы его перехватил компонент <Suspense>
  //  * @param key
  //  */
  // throwWaiting(key: TWaitKey) {
  //   if (this.state.get(key)?.promise) {
  //     throw this.state.get(key)?.promise;
  //   }
  // }

  /**
   * Статуса ожидания. true - ожидание ещё не завершено, false - завершено
   * @param key
   */
  isWaiting(key: TWaitKey) {
    return this.state.get(key)?.waiting || false;
  }

  /**
   * Признак наличия ошибки
   * @param key
   */
  isError(key: TWaitKey) {
    return Boolean(this.state.get(key)?.error);
  }

  /**
   * Результат обещания
   * @param key
   */
  getResult<R>(key: TWaitKey): R {
    return this.state.get(key)?.result;
  }

  /**
   * Ошибка обещания
   * @param key
   */
  getError(key: TWaitKey) {
    return this.state.get(key)?.error;
  }

  /**
   * Обещание
   * @param key
   */
  getPromise<T>(key: TWaitKey): Promise<T> {
    return this.state.get(key)?.promise as Promise<T>;
  }
}
