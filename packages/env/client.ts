import mc from 'merge-change';
import { injectValue } from '../../packages/container';
import { ENV } from './token.ts';

export const envClient = (envPatch: Patch<ImportMetaEnv> = {}) =>
  injectValue({
    token: ENV,
    value: mc.merge(import.meta.env, envPatch),
  });
