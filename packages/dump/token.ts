import { newToken } from '../../packages/token';
import type { DumpService } from './index.ts';
import type { DumpConfig } from './types.ts';

export const DUMP_SERVICE = newToken<DumpService>('@react-skeleton/dump/service');

export const DUMP_CFG = newToken<Patch<DumpConfig>>('@react-skeleton/dump/configs');
