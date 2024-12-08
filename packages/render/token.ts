import { newToken } from '../token';
import type { ReactNode } from 'react';
import type { Patch } from '../types';
import type { RenderService } from './service';
import type { RenderConfig } from './types';

export const RENDER_SERVICE = newToken<RenderService>('@react-solution/render/service');

export const RENDER_CFG = newToken<Patch<RenderConfig>>('@react-solution/render/configs');

export const RENDER_COMPONENT = newToken<ReactNode>('@react-solution/render/component');
