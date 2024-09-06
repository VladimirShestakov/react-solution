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
   * Обещание, выполнение которого ожидается
   */
  promise?: Promise<unknown>,
  /**
   * Таймаут для автоматического удаления ожидания
   */
  timeout?: ReturnType<typeof setTimeout>
  /**
   * Результат выполнения обещания
   */
  result?: R
  /**
   * Ошибка в обещании
   */
  error?: Error
}

/**
 * Состояние всех ожиданий
 */
export type TWaitState<Type = any> = Map<TWaitKey, TWaitRecord<Type>>
