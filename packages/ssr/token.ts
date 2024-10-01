import { newToken } from '../token';
import type { Ssr } from './service.ts';
import type { SsrOptions } from './types.ts';

export const SSR = newToken<Ssr>('@react-solution/ssr/service');

export const SSR_CGF = newToken<Patch<SsrOptions>>('@react-solution/ssr/config');
