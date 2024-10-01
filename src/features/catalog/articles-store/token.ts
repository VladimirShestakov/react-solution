import { newToken } from 'react-solution/token';
import type { DefaultConfig } from 'react-solution/data-params-state';
import type { ArticlesStore } from './index.ts';

export const ARTICLES_STORE = newToken<ArticlesStore>('@project/catalog/articles-store');

export const ARTICLES_STORE_CFG = newToken<Patch<DefaultConfig>>(
  '@project/catalog/articles-store/config',
);
