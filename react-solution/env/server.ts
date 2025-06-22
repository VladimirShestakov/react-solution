import typedVariables from 'dotenv-parse-variables';
import mc, { type Patch } from 'merge-change';
import { loadEnv as loadEnvVite } from 'vite';
import { valueProvider } from '../solutions';
import { ENV } from './token';

export const envServer = (envPatch: Patch<Env> = {}) =>
  valueProvider({
    token: ENV,
    value: mc.merge(
      {
        BASE_URL: '',
        SSR: true,
        MODE: process.env.NODE_ENV || 'development',
        PROD: !process.env.NODE_ENV || process.env.NODE_ENV === 'production',
        DEV: Boolean(process.env.NODE_ENV && process.env.NODE_ENV !== 'production'),
      },
      typedVariables(loadEnvVite(process.env.NODE_ENV || 'production', process.cwd(), '')),
      envPatch,
    ) as Env,
  });
