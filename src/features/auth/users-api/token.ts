import { newToken } from 'react-solution';
import type { Patch } from 'react-solution';
import type { UsersApi } from './index.ts';
import type { UsersApiConfig } from './types.ts';

export const USERS_API = newToken<UsersApi>('@project/auth/users_api');

export const USERS_API_CFG = newToken<Patch<UsersApiConfig>>('@project/auth/users_api/config');
