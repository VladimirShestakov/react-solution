import { newToken } from '../../packages/token';
import type { RouterConfig } from './types.ts';
import type { RouterService } from './service.ts';

export const ROUTER_SERVICE = newToken<RouterService>('@react-skeleton/router/service');

export const ROUTER_CFG = newToken<Patch<RouterConfig>>('@react-skeleton/router/config');
