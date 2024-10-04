import { newToken } from '../token';
import type { Patch } from '../types';
import type { DumpService } from './service';
import type { DumpConfig } from './types';

export const DUMP_SERVICE = newToken<DumpService>('@react-solution/dump/service');

export const DUMP_CFG = newToken<Patch<DumpConfig>>('@react-solution/dump/configs');
