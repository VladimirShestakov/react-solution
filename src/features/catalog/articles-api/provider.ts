import { HTTP_CLIENT } from 'react-solution';
import { classProvider } from 'react-solution';
import { optionalToken } from 'react-solution';
import { ArticlesApi } from './index.ts';
import { ARTICLES_API, ARTICLES_API_CFG } from './token.ts';

export const articlesApi = classProvider({
  token: ARTICLES_API,
  constructor: ArticlesApi,
  depends: {
    httpClient: HTTP_CLIENT,
    config: optionalToken(ARTICLES_API_CFG),
  },
});
