import { HTTP_CLIENT } from '../../../../packages/http-client/token.ts';
import { injectClass } from '../../../../packages/container';
import { optionalToken } from '../../../../packages/token';
import { CategoriesApi } from './index.ts';
import { CATEGORIES_API, CATEGORIES_API_CFG } from './token.ts';

export const categoriesApi = injectClass({
  token: CATEGORIES_API,
  constructor: CategoriesApi,
  depends: {
    httpClient: HTTP_CLIENT,
    config: optionalToken(CATEGORIES_API_CFG),
  }
});
