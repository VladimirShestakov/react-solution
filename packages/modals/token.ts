import { newToken } from '../../packages/token';
import type { Modals } from './service.ts';

export const MODALS = newToken<Modals>('@project/modals/service');
