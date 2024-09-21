import { newToken } from '../../../../packages/token';
import type { CategoriesStore } from './index.ts';
import type { CategoriesStoreConfig } from './types.ts';

export const CATEGORIES_STORE = newToken<CategoriesStore>('@project/catalog/categories-store');

export const CATEGORIES_STORE_CFG = newToken<Patch<CategoriesStoreConfig>>(
  '@project/catalog/categories-store/config',
);
