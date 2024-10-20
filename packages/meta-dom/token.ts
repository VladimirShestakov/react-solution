import { newToken } from '../token';
import type { Patch } from '../types';
import type { MetaDomService } from './service';
import type { MetaDomConfig } from './types';

export const META_DOM_SERVICE = newToken<MetaDomService>('@react-solution/meta-dom/service');

export const META_DOM_CFG = newToken<Patch<MetaDomConfig>>('@react-solution/meta-dom/configs');
