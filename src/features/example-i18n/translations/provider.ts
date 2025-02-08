import { valueProvider } from 'react-solution';
import { I18N_DICTIONARY } from 'react-solution';

export const translations = valueProvider({
  token: I18N_DICTIONARY,
  value: {
    'en-EN': { 'example-i18n': () => import('./en.ts') },
    'ru-RU': { 'example-i18n': () => import('./ru.ts') },
  },
  merge: true,
});
