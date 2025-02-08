import { valueProvider } from 'react-solution';
import { I18N_DICTIONARY } from 'react-solution';

export const translations = valueProvider({
  token: I18N_DICTIONARY,
  value: {
    'en-EN': { 'example-modals': () => import('./en') },
    'ru-RU': { 'example-modals': () => import('./ru') },
  },
  merge: true,
});
