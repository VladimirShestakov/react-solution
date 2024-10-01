import { HTTP_CLIENT } from 'react-solution/http-client';
import { injectClass } from 'react-solution/container';
import { optionalToken } from 'react-solution/token';
import { CategoriesApi } from './index.ts';
import { CATEGORIES_API, CATEGORIES_API_CFG } from './token.ts';

export const categoriesApi = injectClass({
  token: CATEGORIES_API,
  constructor: CategoriesApi,
  depends: {
    httpClient: HTTP_CLIENT,
    config: optionalToken(CATEGORIES_API_CFG),
  },
});
