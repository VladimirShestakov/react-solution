import { newToken } from '@packages/token/utils.ts';
import type { I18n } from './index.ts';
import type { I18nDictionary, I18nConfig } from './types.ts';

/**
 * Токен на сервис i18n
 */
export const I18N = newToken<I18n>('@project/i18n');

/**
 * Токен на настройки сервиса i18n
 */
export const I18N_CFG = newToken<Patch<I18nConfig>>('@project/i18n/config');

/**
 * Токена для подключения словарей.
 * В инъекции используйте опцию merge=true, чтобы дополнять существующий словарь
 */
export const I18N_DICTIONARY = newToken<I18nDictionary>('@project/i18n/dictionary');