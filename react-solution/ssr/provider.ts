import { factoryProvider } from '../container';
import { CACHE_STORE } from '../cache-store';
import { ENV } from '../env';
import { LOG_SERVICE } from '../log';
import { VITE_DEV } from '../vite-dev';
import { SSR, SSR_CGF } from './token';
import { Ssr } from './service';

export const ssr = factoryProvider({
  token: SSR,
  factory: async depends => {
    return new Ssr(depends).init();
  },
  depends: {
    env: ENV,
    cacheStore: CACHE_STORE,
    vite: VITE_DEV,
    configs: SSR_CGF,
    logger: LOG_SERVICE,
  },
});
