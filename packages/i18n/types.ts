import { type TWaitDump } from '../waiting-store';

/**
 * Расширяемое пространство словарей.
 * Во внешних модулях можно добавить тип подключаемого словаря:
 * ```ts
 * declare global {
 *   interface I18nNamespaces {
 *     new_namespace: typeof import('./en.json');
 *   }
 * }
 * ```
 * В итоге станут доступны пути переводов, начинающиеся с "new_namespace."
 */
declare global {
  interface I18nNamespaces {
    [namespace: string]: I18nTranslationImport;
  }
}

export type I18nTranslationValue = string;

/**
 * Дерево переводов
 */
export type I18nTranslation = {
  [word: string]: I18nTranslationValue | I18nTranslation;
};

/**
 * Импортируемое дерево переводов.
 * Может быть функцией, возвращающей дерево переводов.
 * Может быть асинхронной функцией, возвращающей дерево переводов.
 */
export type I18nTranslationImport<T extends I18nTranslation = I18nTranslation> =
  | (() => Promise<T>)
  | (() => T)
  | T;

/**
 * Словарь со всеми языками, пространствами и переводами
 */
export type I18nDictionary = {
  [locale: string]: I18nNamespaces;
};

/**
 * Все пути на переводы с учётом пространств именования
 */
export type I18nPath = ExtractTranslationPaths<{
  [N in keyof I18nNamespaces]: ExtractTranslationTree<I18nNamespaces[N]>;
}>;

/**
 * Вытаскивает тип переводов из импортируемого словаря
 */
export type ExtractTranslationTree<T> =
  T extends I18nTranslationImport<infer Type> ? Type : unknown;

/**
 * Формирует пути на свойства объекта с учётом вложенности
 * Например, ExtractTranslationPaths<typeof {a: {b: {c: 100}}, d: 1 }> => "a.b.c" | "d"
 */
export type ExtractTranslationPaths<Obj extends I18nTranslation> = {
  [Name in keyof Obj & string]: Obj[Name] extends I18nTranslation // Свойство является объектом? // Перебираем ключи объекта
    ? // Если свойство объект, то рекурсия на вложенные свойства. Получится шаблон спутями на все вложенные свойства
      Name | `${Name}.${ExtractTranslationPaths<Obj[Name]>}`
    : // Для остальных типов берем их название
      `${Name}`;
}[keyof Obj & string]; // Вытаскиваем типы всех свойств - это строковые литералы (пути на свойства)

/**
 * Внутренний словарь в плоском формате
 */
export type I18nDictionaryInner = Partial<{
  [locale: string]: Partial<{
    [N in keyof I18nNamespaces]: Record<string, I18nTranslationValue>;
  }>;
}>;

/**
 * Параметры функции перевода
 */
export interface I18nTranslateOptions {
  /**
   * Число для поиска перевода в множественном склонении, например 1 товар, 3 товара, 5 товаров
   */
  plural?: number;
  /**
   * Локаль, отличая от текущей
   */
  locale?: string;
  /**
   * Значения для вставки в именованные области, например "Привет {{name}} {{secondName}}"
   */
  values?: Record<string, string | number>;
  /**
   * Перевод по умолчанию, если его нет в словаре
   */
  fall?: string;
  /**
   * Допустимые локали (по умолчанию определяются на основе подключенных словарей)
   */
  allowedLocales?: string[];
}

/**
 * Опции функции форматирования числа
 */
export interface I18nNumberOptions extends Intl.NumberFormatOptions {
  locale?: string;
}

/**
 * Функция перевода
 */
export type I18nTranslateFn = (key: I18nPath, options?: I18nTranslateOptions) => string;

/**
 * Функция перевода
 */
export type I18nTranslateFnAsync = (
  key: I18nPath,
  options?: I18nTranslateOptions,
) => Promise<string>;

/**
 * Функция форматирования числа
 */
export type I18nNumberFormatFn = (value: number, options?: I18nNumberOptions) => string;

/**
 * Состояние сервиса, чтобы уведомлять про изменения локали или словаря
 */
export type I18nState = {
  locale: string;
  allowedLocales: string[];
  dictionary: I18nDictionaryInner;
};

/**
 * Настройки сервиса ожиданий
 */
export type I18nConfig = {
  log: boolean;
  // Локаль по умолчанию, если отключено автоопределение или не удалось определить.
  // Может быть в формате Accept-Language, чтобы перечислить предпочтительные языки в случаи.
  locale: string;
  // Подобрать локаль автоматически при первом рендере
  auto: boolean;
  // Запоминать выбор локали в куке
  remember: boolean;
};

/**
 * Результат хука к i18n
 */
export type useI18nReturn = {
  // Текущая локаль
  locale: string;
  // Доступные локали
  locales: string[];
  // Функция для смены локали
  setLocale: (locale: string) => void;
  // Функция для локализации текстов
  t: I18nTranslateFn;
  // Форматирования числа с учётом локали
  n: I18nNumberFormatFn;
};

export type I18nDump = {
  state: I18nState;
  waiting: TWaitDump;
};
