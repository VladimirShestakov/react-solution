import { injectValue } from 'react-solution/container';
import { I18N_DICTIONARY } from 'react-solution/i18n';

export const injectTranslations = injectValue({
  token: I18N_DICTIONARY,
  value: {
    'en-EN': { 'example-modals': () => import('./en.json') },
    'ru-RU': { 'example-modals': () => import('./ru.json') },
  },
  merge: true,
});
