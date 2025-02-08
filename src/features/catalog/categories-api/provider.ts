import { HTTP_CLIENT } from 'react-solution';
import { classProvider } from 'react-solution';
import { optionalToken } from 'react-solution';
import { CategoriesApi } from './index.ts';
import { CATEGORIES_API, CATEGORIES_API_CFG } from './token.ts';

export const categoriesApi = classProvider({
  token: CATEGORIES_API,
  constructor: CategoriesApi,
  depends: {
    httpClient: HTTP_CLIENT,
    config: optionalToken(CATEGORIES_API_CFG),
  },
});
