import { newToken } from '../token';
import type { Patch } from 'merge-change';
import type { LogConfig, LogInterface } from './types';

export const LOG_SERVICE = newToken<LogInterface>('@react-solution/log/service');

export const LOG_CFG = newToken<Patch<LogConfig>>('@react-solution/log/configs');
