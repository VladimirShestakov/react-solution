import { newToken } from '../token';
import type { Proxy } from './service.ts';
import type { ProxyOptions } from './types.ts';

export const PROXY = newToken<Proxy>('@react-solution/proxy/service');

export const PROXY_CFG = newToken<Patch<ProxyOptions>>('@react-solution/proxy/configs');
