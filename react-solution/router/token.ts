import { newToken } from '../token';
import type { Patch } from 'merge-change';
import type { RouterConfig } from './types';
import type { RouterService } from './service';

export const ROUTER_SERVICE = newToken<RouterService>('@react-solution/router/service');

export const ROUTER_CFG = newToken<Patch<RouterConfig>>('@react-solution/router/config');
