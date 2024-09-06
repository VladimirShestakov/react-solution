import { injectFabric } from '@packages/container/utils.ts';
import { Ssr } from './index.ts';
import { CACHE_STORE } from '@packages/cache-store/token.ts';
import { ENV } from '@packages/env/token.ts';
import { VITE_DEV } from '@packages/vite-dev/token.ts';
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
