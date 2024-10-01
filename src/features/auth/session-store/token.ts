import { newToken } from 'react-solution/token';
import type { SessionStore } from './index.ts';
import type { SessionStoreConfig } from './types.ts';

export const SESSION_STORE = newToken<SessionStore>('@project/auth/session-store');

export const SESSION_STORE_CFG = newToken<Patch<SessionStoreConfig>>(
  '@project/auth/session-store/config',
);
