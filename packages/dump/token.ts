import { newToken } from '../token';
import type { DumpService } from './service.ts';
import type { DumpConfig } from './types.ts';

export const DUMP_SERVICE = newToken<DumpService>('@react-solution/dump/service');

export const DUMP_CFG = newToken<Patch<DumpConfig>>('@react-solution/dump/configs');
