import { newToken } from '../../packages/token';
import type { Ssr } from './service.ts';
import type { SsrOptions } from './types.ts';

export const SSR = newToken<Ssr>('@react-skeleton/ssr/service');

export const SSR_CGF = newToken<Patch<SsrOptions>>('@react-skeleton/ssr/config');
