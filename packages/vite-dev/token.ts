import { newToken } from '../../packages/token';
import type { ViteDev } from './service.ts';

export const VITE_DEV = newToken<ViteDev>('@react-skeleton/vite-dev/service');
