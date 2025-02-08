import { valueProvider } from 'react-solution';
import { I18N_DICTIONARY } from 'react-solution';

export const translations = valueProvider({
  token: I18N_DICTIONARY,
  value: {
    'en-EN': { auth: () => import('./en.auth.json') },
    'ru-RU': { auth: () => import('./ru.auth.json') },
  },
  merge: true,
});
