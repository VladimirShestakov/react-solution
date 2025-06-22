import { newToken } from 'react-solution';
import type { Patch } from 'merge-change';
import type { ProfileStore } from './index.ts';
import type { ProfileStoreConfig } from './types.ts';

export const PROFILE_STORE = newToken<ProfileStore>('@project/auth/profile-store');

export const PROFILE_STORE_CFG = newToken<Patch<ProfileStoreConfig>>(
  '@project/auth/profile-store/config',
);
