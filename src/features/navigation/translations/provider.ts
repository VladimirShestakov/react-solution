import { valueProvider } from 'react-solution';
import { I18N_DICTIONARY } from 'react-solution';

export const translations = valueProvider({
  token: I18N_DICTIONARY,
  value: {
    'en-EN': { navigation: () => import('./en.json') },
    'ru-RU': { navigation: () => import('./ru.json') },
  },
  merge: true,
});
