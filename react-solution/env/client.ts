import mc, { type Patch } from 'merge-change';
import { valueProvider } from '../solutions';
import { ENV } from './token';

export const envClient = (envPatch: Patch<Env> = {}) => {
  return valueProvider({
    token: ENV,
    value: mc.merge(
      {
        BASE_URL: '',
        SSR: false,
        MODE: process.env.NODE_ENV || 'development',
        PROD: !process.env.NODE_ENV || process.env.NODE_ENV === 'production',
        DEV: Boolean(process.env.NODE_ENV && process.env.NODE_ENV !== 'production'),
      },
      envPatch,
    ) as Env,
  });
};
