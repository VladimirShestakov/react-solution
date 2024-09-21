import { newToken } from '../../packages/token';
import type { Proxy } from './service.ts';
import type { ProxyOptions } from './types.ts';

export const PROXY = newToken<Proxy>('@react-skeleton/proxy/service');

export const PROXY_CFG = newToken<Patch<ProxyOptions>>('@react-skeleton/proxy/configs');
