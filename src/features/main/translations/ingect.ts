import { injectValue } from '../../../../packages/container';
import { I18N_DICTIONARY } from '../../../../packages/i18n';

export const injectTranslations = injectValue({
  token: I18N_DICTIONARY,
  value: {
    'en-EN': { main: () => import('./en.js') },
    'ru-RU': { main: () => import('./ru.js') },
  },
  merge: true,
});
