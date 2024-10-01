import { injectValue } from 'react-solution/container';
import { I18N_DICTIONARY } from 'react-solution/i18n';

export const injectTranslations = injectValue({
  token: I18N_DICTIONARY,
  value: {
    'en-EN': { navigation: () => import('./en.json') },
    'ru-RU': { navigation: () => import('./ru.json') },
  },
  merge: true,
});
