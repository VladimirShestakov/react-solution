import { injectClass } from '../../packages/container';
import { Proxy } from './service.ts';
import { PROXY, PROXY_CFG } from './token.ts';

export const proxy = injectClass({
  token: PROXY,
  constructor: Proxy,
  depends: {
    config: PROXY_CFG,
  },
});
