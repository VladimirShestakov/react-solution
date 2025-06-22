import { newToken } from '../token';
import type { Patch } from 'merge-change';
import type { Ssr } from './service';
import type { SsrOptions } from './types';

export const SSR = newToken<Ssr>('@react-solution/ssr/service');

export const SSR_CGF = newToken<Patch<SsrOptions>>('@react-solution/ssr/config');
