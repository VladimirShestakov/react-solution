import { injectFabric } from '../container/utils.ts';
import { Ssr } from './index.ts';
import { CACHE_STORE } from '../cache-store/token.ts';
import { ENV } from '../env/token.ts';
import { VITE_DEV } from '../vite-dev/token.ts';
import { SSR, SSR_CGF } from './token.ts';

export const ssr = injectFabric({
  token: SSR,
  fabric: async (depends) => {
    return new Ssr(depends).init();
  },
  depends: {
    env: ENV,
    cacheStore: CACHE_STORE,
    vite: VITE_DEV,
    configs: SSR_CGF,
  }
});
