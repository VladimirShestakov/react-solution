import type { RenderService } from './service.ts';

export type RootFabric = (envPartial: Partial<Env>) => Promise<RenderService>;
