import mc from 'merge-change';
import { injectValue } from '../container';
import { ENV } from './token';
import type { Patch } from '../types';

export const envClient = (envPatch: Patch<Env> = {}) =>
  injectValue({
    token: ENV,
    value: mc.merge(import.meta.env as Env, envPatch),
  });
