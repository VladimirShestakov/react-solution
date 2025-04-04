import { classProvider } from '../solutions';
import { ENV } from '../env';
import { optionalToken } from '../token';
import { RouterService } from './service';
import { ROUTER_SERVICE, ROUTER_CFG } from './token';

export const routerService = classProvider({
  token: ROUTER_SERVICE,
  constructor: RouterService,
  depends: {
    env: ENV,
    config: optionalToken(ROUTER_CFG),
  },
});
