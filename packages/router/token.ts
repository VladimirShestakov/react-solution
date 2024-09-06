import type { RouterConfig } from '@packages/router/types.ts';
import type { Router } from './index.ts';
import { newToken } from '@packages/token/utils.ts';

export const ROUTER = newToken<Router>('@react-skeleton/router');

export const ROUTER_CFG = newToken<Patch<RouterConfig>>('@react-skeleton/router/config');
