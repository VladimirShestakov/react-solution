import type { I18nState } from '@packages/i18n/types.ts';

/**
 * Проверка на TI18nState
 */
export function isI18nState(value: I18nState | unknown): value is Partial<I18nState> {
  return !!value && typeof value === 'object'
    && ('locale' in value) && typeof value.locale === 'string';
}