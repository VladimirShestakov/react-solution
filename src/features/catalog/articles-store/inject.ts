import { injectClass } from '@packages/container/utils.ts';
import { optionalToken } from '@packages/token/utils.ts';
import { ENV } from '@packages/env/token.ts';
import { ROUTER } from '@packages/router/token.ts';
import { ARTICLES_API } from '@src/features/catalog/articles-api/token.ts';
import { ARTICLES_STORE, ARTICLES_STORE_CFG } from './token.ts';
import { ArticlesStore } from './index.ts';

export const articlesStore = injectClass({
  token: ARTICLES_STORE,
  constructor: ArticlesStore,
  depends: {
    env: ENV,
    articlesApi: ARTICLES_API,
    router: ROUTER,
    config: optionalToken(ARTICLES_STORE_CFG),
  }
});
