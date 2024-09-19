import { useSyncExternalStore } from 'react';
import { useService } from '../../packages/container';
import { I18N } from './token.ts';
import type { I18nPath, I18nTranslateOptions, useI18nReturn } from './types.ts';

/**
 * Хук возвращает функцию для локализации текстов, текущую локаль, доступные локали и функцию смены локали.
 * Отслеживает изменения локали или загрузки словаря для перерендера компонента
 * @throws
 */
export default function useI18n(): useI18nReturn {
  const i18n = useService(I18N);
  const state = useSyncExternalStore(i18n.state.subscribe, i18n.state.get, i18n.state.get);

  // Возвращаются новые функции, чтобы выполнялся рендер при сменен локали (если функции будут проброшены другим компонентам)
  return {
    // Текущая локаль
    locale: state.locale,
    // Доступные локали
    locales: state.allowedLocales,
    // Функция для смены локали
    setLocale: (locale: string) => i18n.setLocale(locale),
    // Функция для локализации текстов
    t: (key: I18nPath, options?: I18nTranslateOptions) => i18n.translateSync(key, options),
    // Форматирования числа с учётом локали
    n: (value: number, options?) => i18n.number(value, options),
  };
}

/**
 * Возвращает функцию для перевода
 * @throws
 */
export function useTranslate() {
  return useI18n().t;
}
