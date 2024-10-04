import { newToken } from '../token';
import type { ViteDev } from './service';

export const VITE_DEV = newToken<ViteDev>('@react-solution/vite-dev/service');
