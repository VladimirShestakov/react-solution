import { newToken } from '../token';
import type { ViteDev } from './service.ts';

export const VITE_DEV = newToken<ViteDev>('@react-solution/vite-dev/service');
