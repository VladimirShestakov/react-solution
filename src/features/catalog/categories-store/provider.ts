import { classProvider, LOG_SERVICE } from 'react-solution';
import { optionalToken } from 'react-solution';
import { CATEGORIES_API } from '../categories-api/token.ts';
import { CategoriesStore } from './index.ts';
import { CATEGORIES_STORE, CATEGORIES_STORE_CFG } from './token.ts';

export const categoriesStore = classProvider({
  token: CATEGORIES_STORE,
  constructor: CategoriesStore,
  depends: {
    categoriesApi: CATEGORIES_API,
    config: optionalToken(CATEGORIES_STORE_CFG),
    logger: LOG_SERVICE,
  },
});
