import { HTTP_CLIENT } from '@packages/http-client/token.ts';
import { injectClass } from '@packages/container/utils.ts';
import { optionalToken } from '@packages/token/utils.ts';
import { UsersApi } from './index.ts';
import { USERS_API, USERS_API_CFG } from './token.ts';

export const usersApi = injectClass({
  token: USERS_API,
  constructor: UsersApi,
  depends: {
    httpClient: HTTP_CLIENT,
    config: optionalToken(USERS_API_CFG),
  }
});
