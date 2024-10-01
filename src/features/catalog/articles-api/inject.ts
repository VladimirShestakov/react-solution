import { HTTP_CLIENT } from 'react-solution/http-client';
import { injectClass } from 'react-solution/container';
import { optionalToken } from 'react-solution/token';
import { ArticlesApi } from './index.ts';
import { ARTICLES_API, ARTICLES_API_CFG } from './token.ts';

export const articlesApi = injectClass({
  token: ARTICLES_API,
  constructor: ArticlesApi,
  depends: {
    httpClient: HTTP_CLIENT,
    config: optionalToken(ARTICLES_API_CFG),
  },
});
