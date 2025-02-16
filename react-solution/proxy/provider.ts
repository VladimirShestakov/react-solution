import { classProvider } from '../solutions';
import { Proxy } from './service';
import { PROXY, PROXY_CFG } from './token';

export const proxy = classProvider({
  token: PROXY,
  constructor: Proxy,
  depends: {
    config: PROXY_CFG,
  },
});
