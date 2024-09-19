import { newToken } from '../../packages/token';
import type { RenderService } from './index.ts';
import type { RenderConfig } from './types.ts';

export const RENDER_SERVICE = newToken<RenderService>('@react-skeleton/render/service');

export const RENDER_CFG = newToken<Patch<RenderConfig>>('@react-skeleton/render/configs');
