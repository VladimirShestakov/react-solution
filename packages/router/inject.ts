import { injectClass } from '../../packages/container';
import { ENV } from '../../packages/env';
import { optionalToken } from '../../packages/token';
import { RouterService } from './service.ts';
import { ROUTER_SERVICE, ROUTER_CFG } from './token.ts';

export const routerService = injectClass({
  token: ROUTER_SERVICE,
  constructor: RouterService,
  depends: {
    env: ENV,
    config: optionalToken(ROUTER_CFG),
  },
});
