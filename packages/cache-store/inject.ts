import { injectClass } from '../container';
import { CacheStore } from './service.ts';
import { CACHE_STORE, CACHE_STORE_CFG } from './token.ts';

export const cacheStore = injectClass({
  token: CACHE_STORE,
  constructor: CacheStore,
  depends: {
    config: CACHE_STORE_CFG,
  },
});
