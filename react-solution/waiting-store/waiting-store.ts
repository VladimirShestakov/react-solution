import { isPromise } from '../utils';
import type { TWaitDump, TWaitKey, TWaitRecord, TWaitState } from './types';
import { WaitStatus } from './constants';

/**
 * Хранилище ожиданий.
 */
export class WaitingStore<Type = any> {
  private state: TWaitState<Type> = new Map();

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
  add<P extends Promise<Type>>(key: TWaitKey, promise: P | Type) {
    if (isPromise(promise)) {
      this.state.set(key, {
        waiting: true,
        // При завершении промиса будет сброс признака waiting
        promise: promise
          .then(result => this.complete(key, { result }))
          .catch(error => {
            this.complete(key, { error });
            return error;
          }),
      });
    } else {
      this.state.set(key, {
        waiting: false,
        // При завершении промиса будет сброс признака waiting
        promise: Promise.resolve(promise),
        result: promise,
      });
    }
  }

  /**
   * Завершение ожидания
   * Информация про ожидание остаётся, чтобы помнить про его завершенность
   * @param key
   * @param result Результат обещания
   * @param error Ошибка обещания
   */
  complete(key: TWaitKey, { result, error }: { result?: Type; error?: Error }): Type | undefined {
    if (this.has(key)) {
      // Мутируем
      const item = this.state.get(key) as TWaitRecord;
      item.waiting = false;
      item.result = result;
      item.error = error;
    } else {
      this.state.set(key, {
        waiting: false,
        result,
        error,
        promise: error ? Promise.reject(error) : (Promise.resolve(result) as Promise<Type>),
      });
    }
    return result;
  }

  /**
   * Удаление ожидания
   * @param key
   */
  delete(key: TWaitKey) {
    this.state.delete(key);
  }

  /**
   * Отсутствие ожидания
   * @param key
   */
  isMissing(key: TWaitKey): boolean {
    return !this.state.has(key);
  }

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
    return !this.isWaiting(key) && Boolean(this.state.get(key)?.error);
  }

  /**
   * Признак успешного выполнения обещания
   * @param key
   */
  isSuccess(key: TWaitKey) {
    return this.has(key) && !this.isWaiting(key) && !this.isError(key);
  }

  getStatus(key: TWaitKey): WaitStatus {
    const item = this.state.get(key);
    if (item) {
      if (item.result) return WaitStatus.Success;
      if (item.waiting) return WaitStatus.Waiting;
      if (item.error) return WaitStatus.Error;
    }
    return WaitStatus.Absent;
  }

  /**
   * Результат обещания
   * @param key
   */
  getResult(key: TWaitKey): Type | undefined {
    return this.state.get(key)?.result;
  }

  /**
   * Ошибка обещания
   * @param key
   */
  getError(key: TWaitKey): Error | undefined {
    return this.state.get(key)?.error;
  }

  /**
   * Обещание
   * @param key
   */
  getPromise(key: TWaitKey): Promise<Type> | undefined {
    return this.state.get(key)?.promise;
  }

  entries() {
    return this.state.entries();
  }

  /**
   * Экспорт дампа
   */
  getDump(): TWaitDump<Type> {
    const dump: TWaitDump<Type> = {};
    this.state.forEach((item, key) => {
      if (!item.waiting) {
        dump[key] = {};
        if (item.error) dump[key].error = item.error.message;
        if ('result' in item) dump[key].result = item.result;
      }
    });
    return dump;
  }

  /**
   * Установка дампа
   * @param dump
   */
  setDump(dump: TWaitDump<Type>): void {
    const state: TWaitState<Type> = new Map();
    Object.entries(dump).forEach(([key, item]) => {
      state.set(key, {
        waiting: false,
        promise: item.error
          ? Promise.reject(item.error)
          : (Promise.resolve(item.result) as Promise<Type>),
        error: item.error ? new Error(item.error) : undefined,
        result: item.result,
      });
    });
    this.state = state;
  }
}
