import { injectValue } from '@packages/container/utils.ts';
import { I18N_DICTIONARY } from '@packages/i18n/token.ts';

export const injectTranslations = injectValue({
  token: I18N_DICTIONARY,
  value: {
    'en-EN': { 'example-i18n': () => import('./en.ts') },
    'ru-RU': { 'example-i18n': () => import('./ru.ts') },
  },
  merge: true
});