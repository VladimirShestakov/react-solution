import { injectClass } from '../container';
import { Proxy } from './service';
import { PROXY, PROXY_CFG } from './token';

export const proxy = injectClass({
  token: PROXY,
  constructor: Proxy,
  depends: {
    config: PROXY_CFG,
  },
});
