import { injectClass } from '@packages/container/utils.ts';
import { I18n } from '@packages/i18n/index.ts';
import { optionalToken } from '@packages/token/utils.ts';
import { I18N, I18N_CFG, I18N_DICTIONARY } from './token.ts';
import { ENV } from '@packages/env/token.ts';

export const i18n = injectClass({
  token: I18N,
  constructor: I18n,
  depends: {
    env: ENV,
    config: optionalToken(I18N_CFG),
    dictionary: I18N_DICTIONARY
  }
});
