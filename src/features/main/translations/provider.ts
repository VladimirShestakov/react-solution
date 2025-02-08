import { valueProvider } from 'react-solution';
import { I18N_DICTIONARY } from 'react-solution';

export const translations = valueProvider({
  token: I18N_DICTIONARY,
  value: {
    'en-EN': { main: () => import('./en.js') },
    'ru-RU': { main: () => import('./ru.js') },
  },
  merge: true,
});
