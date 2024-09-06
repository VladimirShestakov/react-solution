import { injectClass } from '@packages/container/utils.ts';
import { optionalToken } from '@packages/token/utils.ts';
import { CATEGORIES_API } from '../categories-api/token.ts';
import { CategoriesStore } from './index.ts';
import { CATEGORIES_STORE, CATEGORIES_STORE_CFG } from './token.ts';

export const categoriesStore = injectClass({
  token: CATEGORIES_STORE,
  constructor: CategoriesStore,
  depends: {
    categoriesApi: CATEGORIES_API,
    config: optionalToken(CATEGORIES_STORE_CFG),
  }
});