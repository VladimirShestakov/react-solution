/**
 * Ключ ожидания
 */
export type TWaitKey = string;

/**
 * Данные про ожидание
 */
export type TWaitRecord<ResultType = any> = {
  /**
   * Признак ожидания
   */
  waiting: boolean;
  /**
   * Обещание, выполнение которого ожидается
   */
  promise: Promise<ResultType>;
  /**
   * Таймаут для автоматического удаления ожидания
   */
  timeout?: ReturnType<typeof setTimeout>;
  /**
   * Результат выполнения обещания
   */
  result?: ResultType;
  /**
   * Ошибка в обещании
   */
  error?: Error;
};

/**
 * Состояние всех ожиданий
 */
export type TWaitState<ResultType = any> = Map<TWaitKey, TWaitRecord<ResultType>>;

/**
 * Дамп состояния
 */
export type TWaitDump<ResultType = any> = Record<
  TWaitKey,
  {
    error?: string;
    result?: ResultType;
  }
>;
