import mc from 'merge-change';
import { valueProvider } from '../solutions';
import { ENV } from './token';
import type { Patch } from '../types';

export const envClient = (envPatch: Patch<Env> = {}) =>
  valueProvider({
    token: ENV,
    value: mc.merge<Env>(
      {
        SSR: false,
        MODE: process.env.NODE_ENV || 'development',
        PROD: !process.env.NODE_ENV || process.env.NODE_ENV === 'production',
        DEV: Boolean(process.env.NODE_ENV && process.env.NODE_ENV !== 'production'),
      },
      envPatch,
    ),
  });
