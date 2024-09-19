import { HTTP_CLIENT } from '../../../../packages/http-client/token.ts';
import { injectClass } from '../../../../packages/container';
import { optionalToken } from '../../../../packages/token';
import { ArticlesApi } from './index.ts';
import { ARTICLES_API, ARTICLES_API_CFG } from './token.ts';

export const articlesApi = injectClass({
  token: ARTICLES_API,
  constructor: ArticlesApi,
  depends: {
    httpClient: HTTP_CLIENT,
    config: optionalToken(ARTICLES_API_CFG),
  }
});
