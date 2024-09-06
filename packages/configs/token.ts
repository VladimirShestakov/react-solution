import { newToken } from '@packages/token/utils.ts';
import type { Configs } from './index';

export const CONFIGS = newToken<Configs>('@react-skeleton/configs');
