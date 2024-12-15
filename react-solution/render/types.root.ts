import type { Container } from '../container';

export type SolutionsFactory = (envPartial: Partial<Env>) => Promise<Container>;
