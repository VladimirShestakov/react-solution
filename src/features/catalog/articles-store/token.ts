import { newToken } from '../../../../packages/token';
import type { DefaultConfig } from '../../../../packages/data-params-state';
import type { ArticlesStore } from './index.ts';

export const ARTICLES_STORE = newToken<ArticlesStore>('@project/catalog/articles-store');

export const ARTICLES_STORE_CFG = newToken<Patch<DefaultConfig>>(
  '@project/catalog/articles-store/config',
);
