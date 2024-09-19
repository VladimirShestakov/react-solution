import { injectValue } from '../../../../packages/container';
import { I18N_DICTIONARY } from '../../../../packages/i18n/token.ts';

export const injectTranslations = injectValue({
  token: I18N_DICTIONARY,
  value: {
    'en-EN': { auth: () => import('./en.auth.json') },
    'ru-RU': { auth: () => import('./ru.auth.json') },
  },
  merge: true
});
