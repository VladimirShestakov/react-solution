import { injectValue } from 'react-solution';
import { I18N_DICTIONARY } from 'react-solution';

export const injectTranslations = injectValue({
  token: I18N_DICTIONARY,
  value: {
    'en-EN': { main: () => import('./en.js') },
    'ru-RU': { main: () => import('./ru.js') },
  },
  merge: true,
});
