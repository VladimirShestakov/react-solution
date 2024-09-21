import { injectValue } from '../../../../packages/container';
import { I18N_DICTIONARY } from '../../../../packages/i18n';

export const injectTranslations = injectValue({
  token: I18N_DICTIONARY,
  value: {
    'en-EN': { 'example-i18n': () => import('./en.ts') },
    'ru-RU': { 'example-i18n': () => import('./ru.ts') },
  },
  merge: true,
});
