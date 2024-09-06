import { injectValue } from '@packages/container/utils.ts';
import { I18N_DICTIONARY } from '@packages/i18n/token.ts';

export const injectTranslations = injectValue({
  token: I18N_DICTIONARY,
  value: {
    'en-EN': { navigation: () => import('./en.json') },
    'ru-RU': { navigation: () => import('./ru.json') },
  },
  merge: true
});
