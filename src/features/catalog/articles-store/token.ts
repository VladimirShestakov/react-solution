import { newToken } from 'react-solution';
import type { Patch } from 'merge-change';
import type { DefaultConfig } from 'react-solution';
import type { ArticlesStore } from './index.ts';

export const ARTICLES_STORE = newToken<ArticlesStore>('@project/catalog/articles-store');

export const ARTICLES_STORE_CFG = newToken<Patch<DefaultConfig>>(
  '@project/catalog/articles-store/config',
);
