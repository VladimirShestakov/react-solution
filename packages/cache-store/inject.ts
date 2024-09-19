import { injectClass } from '../../packages/container';
import { CacheStore } from './index.ts';
import { CACHE_STORE, CACHE_STORE_CFG } from './token.ts';

export const cacheStore = injectClass({
  token: CACHE_STORE,
  constructor: CacheStore,
  depends: {
    config: CACHE_STORE_CFG,
  },
});
