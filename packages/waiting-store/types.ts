/**
 * Ключ ожидания
 */
export type TWaitKey = string | number | symbol

/**
 * Данные про ожидание
 */
export type TWaitRecord<R = any> = {
  /**
   * Признак ожидания
   */
  waiting: boolean,
  /**
   * Промис, завершение которого ожидается
   */
  promise?: Promise<unknown>,
  /**
   * Таймаут для автоматического удаления ожидания
   */
  timeout?: ReturnType<typeof setTimeout>
  /**
   * Результат промиса
   */
  result?: R
  /**
   * Ошибка в ожидании
   */
  error?: Error
}

/**
 * Состояние всех ожиданий
 */
export type TWaitState = Map<TWaitKey, TWaitRecord>
