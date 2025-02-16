import type { Solutions } from '../solutions';

export type SolutionsFactory = (envPartial: Partial<Env>) => Promise<Solutions>;
