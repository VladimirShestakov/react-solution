import { newToken } from 'react-solution/token';
import type { App } from './index.ts';
import type { AppConfig } from './types.ts';

export const APP = newToken<App>('@project/app');

export const APP_CFG = newToken<Patch<AppConfig>>('@project/app/config');
