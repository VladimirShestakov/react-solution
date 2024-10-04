import { newToken } from '../token';
import type { ICacheStore, TCacheConfig } from './types';
import type { Patch } from '../types';

export const CACHE_STORE = newToken<ICacheStore>('@react-solution/cache-store/service');

export const CACHE_STORE_CFG = newToken<Patch<TCacheConfig>>('@react-solution/cache-store/config');
