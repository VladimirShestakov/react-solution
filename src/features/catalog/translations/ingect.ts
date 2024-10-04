import { injectValue } from 'react-solution';
import { I18N_DICTIONARY } from 'react-solution';

export const injectTranslations = injectValue({
  token: I18N_DICTIONARY,
  value: {
    'en-EN': { catalog: () => import('./en.json') },
    'ru-RU': { catalog: () => import('./ru.json') },
  },
  merge: true,
});
