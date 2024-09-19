import { newToken } from '../../packages/token';
import type { Configs } from './index';

export const CONFIGS = newToken<Configs>('@react-skeleton/configs');
