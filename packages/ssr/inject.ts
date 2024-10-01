import { injectFabric } from '../container';
import { CACHE_STORE } from '../cache-store';
import { ENV } from '../env';
import { VITE_DEV } from '../vite-dev';
import { SSR, SSR_CGF } from './token.ts';
import { Ssr } from './service.ts';

export const ssr = injectFabric({
  token: SSR,
  fabric: async depends => {
    return new Ssr(depends).init();
  },
  depends: {
    env: ENV,
    cacheStore: CACHE_STORE,
    vite: VITE_DEV,
    configs: SSR_CGF,
  },
});
