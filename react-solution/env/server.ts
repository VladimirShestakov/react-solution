import typedVariables from 'dotenv-parse-variables';
import mc from 'merge-change';
import { loadEnv as loadEnvVite } from 'vite';
import { valueProvider } from '../container';
import { ENV } from './token';
import type { Patch } from '../types';

export const envServer = (envPatch: Patch<Env> = {}) =>
  valueProvider({
    token: ENV,
    value: mc.merge(
      {
        SSR: true,
        MODE: process.env.NODE_ENV || 'development',
        PROD: !process.env.NODE_ENV || process.env.NODE_ENV === 'production',
        DEV: Boolean(process.env.NODE_ENV && process.env.NODE_ENV !== 'production'),
      } as Env,
      typedVariables(loadEnvVite(process.env.NODE_ENV || 'production', process.cwd(), '')),
      envPatch,
    ),
  });
