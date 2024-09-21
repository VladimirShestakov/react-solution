import { newToken } from '../../packages/token';
import type { ICacheStore, TCacheConfig } from './types';

export const CACHE_STORE = newToken<ICacheStore>('@react-skeleton/cache-store/service');

export const CACHE_STORE_CFG = newToken<Patch<TCacheConfig>>('@react-skeleton/cache-store/config');
