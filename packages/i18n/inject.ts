import { injectClass } from '../../packages/container';
import { optionalToken } from '../../packages/token';
import { ENV } from '../../packages/env';
import { I18N, I18N_CFG, I18N_DICTIONARY } from './token.ts';
import { I18n } from './service.ts';

export const i18nService = injectClass({
  token: I18N,
  constructor: I18n,
  depends: {
    env: ENV,
    config: optionalToken(I18N_CFG),
    dictionary: I18N_DICTIONARY,
  },
});
