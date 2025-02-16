import { classProvider } from '../solutions';
import { CacheStore } from './service';
import { CACHE_STORE, CACHE_STORE_CFG } from './token';

export const cacheStore = classProvider({
  token: CACHE_STORE,
  constructor: CacheStore,
  depends: {
    config: CACHE_STORE_CFG,
  },
});
