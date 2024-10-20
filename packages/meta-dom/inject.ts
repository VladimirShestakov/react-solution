import {  injectClass } from '../container';
import { optionalToken } from '../token';
import { ENV } from '../env';
import { MetaDomService } from './service';
import { META_DOM_SERVICE, META_DOM_CFG } from './token';

export const metaDomService = injectClass({
  token: META_DOM_SERVICE,
  constructor: MetaDomService,
  depends: {
    env: ENV,
    config: optionalToken(META_DOM_CFG),
  },
});
