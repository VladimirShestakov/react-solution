import { newToken } from 'react-solution';
import type { Patch } from 'react-solution';
import type { CategoriesApi } from './index.ts';
import type { CategoriesApiConfig } from './types.ts';

export const CATEGORIES_API = newToken<CategoriesApi>('@project/catalog/categories_api');

export const CATEGORIES_API_CFG = newToken<Patch<CategoriesApiConfig>>(
  '@project/catalog/categories_api/config',
);
