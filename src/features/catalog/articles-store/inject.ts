import { injectClass } from '../../../../packages/container';
import { optionalToken } from '../../../../packages/token';
import { ENV } from '../../../../packages/env';
import { ROUTER_SERVICE } from '../../../../packages/router';
import { ARTICLES_API } from '@src/features/catalog/articles-api/token.ts';
import { ARTICLES_STORE, ARTICLES_STORE_CFG } from './token.ts';
import { ArticlesStore } from './index.ts';

export const articlesStore = injectClass({
  token: ARTICLES_STORE,
  constructor: ArticlesStore,
  depends: {
    env: ENV,
    articlesApi: ARTICLES_API,
    router: ROUTER_SERVICE,
    config: optionalToken(ARTICLES_STORE_CFG),
  },
});
