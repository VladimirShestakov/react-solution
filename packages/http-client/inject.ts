import { injectClass } from '../container/utils.ts';
import { HttpClient } from './index.ts';
import { HTTP_CLIENT, HTTP_CLIENT_CFG } from './token.ts';

export const httpClient = injectClass({
  token: HTTP_CLIENT,
  constructor: HttpClient,
  depends: {
    config: HTTP_CLIENT_CFG
  }
});
