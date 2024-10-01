import { newToken } from '../token';
import type { RenderService } from './service.ts';
import type { RenderConfig } from './types.ts';

export const RENDER_SERVICE = newToken<RenderService>('@react-solution/render/service');

export const RENDER_CFG = newToken<Patch<RenderConfig>>('@react-solution/render/configs');
