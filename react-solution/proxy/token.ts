import { newToken } from '../token';
import type { Patch } from 'merge-change';
import type { Proxy } from './service';
import type { ProxyOptions } from './types';

export const PROXY = newToken<Proxy>('@react-solution/proxy/service');

export const PROXY_CFG = newToken<Patch<ProxyOptions>>('@react-solution/proxy/configs');
