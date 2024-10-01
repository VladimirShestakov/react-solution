import { injectValue } from 'react-solution/container';
import { I18N_DICTIONARY } from 'react-solution/i18n';

export const injectTranslations = injectValue({
  token: I18N_DICTIONARY,
  value: {
    'en-EN': { 'example-i18n': () => import('./en.ts') },
    'ru-RU': { 'example-i18n': () => import('./ru.ts') },
  },
  merge: true,
});
