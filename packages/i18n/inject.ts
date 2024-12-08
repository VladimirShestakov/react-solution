import { injectClass } from '../container';
import { LOG_SERVICE } from '../log';
import { optionalToken } from '../token';
import { ENV } from '../env';
import { I18N, I18N_CFG, I18N_DICTIONARY } from './token';
import { I18n } from './service';

export const i18nService = injectClass({
  token: I18N,
  constructor: I18n,
  depends: {
    env: ENV,
    config: optionalToken(I18N_CFG),
    dictionary: I18N_DICTIONARY,
    logger: optionalToken(LOG_SERVICE),
  },
});
