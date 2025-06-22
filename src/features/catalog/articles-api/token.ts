import { newToken } from 'react-solution';
import type { Patch } from 'merge-change';
import type { ArticlesApi } from './index.ts';
import type { ArticlesApiConfig } from './types.ts';

export const ARTICLES_API = newToken<ArticlesApi>('@project/catalog/articles_api');

export const ARTICLES_API_CFG = newToken<Patch<ArticlesApiConfig>>(
  '@project/catalog/articles_api/config',
);
