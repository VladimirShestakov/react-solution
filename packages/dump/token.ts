import { newToken } from '@packages/token/utils.ts';
import type { Dump } from '@packages/dump/index.ts';
import type { DumpConfig } from './types.ts';

export const DUMP = newToken<Dump>('@react-skeleton/dump');

export const DUMP_CFG = newToken<Patch<DumpConfig>>('@react-skeleton/dump/configs');
