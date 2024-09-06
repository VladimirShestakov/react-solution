import { injectClass } from '@packages/container/utils.ts';
import { ENV } from '@packages/env/token.ts';
import { optionalToken } from '@packages/token/utils.ts';
import { Router } from './index.ts';
import { ROUTER, ROUTER_CFG } from './token.ts';

export const router = injectClass({
  token: ROUTER,
  constructor: Router,
  depends: {
    env: ENV,
    config: optionalToken(ROUTER_CFG),
  },
});
