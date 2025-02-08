import { classProvider, LOG_SERVICE } from 'react-solution';
import { optionalToken } from 'react-solution';
import { ENV } from 'react-solution';
import { ROUTER_SERVICE } from 'react-solution';
import { ARTICLES_API } from '@src/features/catalog/articles-api/token.ts';
import { ARTICLES_STORE, ARTICLES_STORE_CFG } from './token.ts';
import { ArticlesStore } from './index.ts';

export const articlesStore = classProvider({
  token: ARTICLES_STORE,
  constructor: ArticlesStore,
  depends: {
    env: ENV,
    articlesApi: ARTICLES_API,
    router: ROUTER_SERVICE,
    config: optionalToken(ARTICLES_STORE_CFG),
    logger: LOG_SERVICE,
  },
});
