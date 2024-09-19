import { injectValue } from '../../../../packages/container';
import { I18N_DICTIONARY } from '../../../../packages/i18n/token.ts';

export const injectTranslations = injectValue({
  token: I18N_DICTIONARY,
  value: {
    'en-EN': { 'example-modals': () => import('./en.json') },
    'ru-RU': { 'example-modals': () => import('./ru.json') },
  },
  merge: true
});
