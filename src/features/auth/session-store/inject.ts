import { injectClass } from '@packages/container/utils.ts';
import { ENV } from '@packages/env/token.ts';
import { HTTP_CLIENT } from '@packages/http-client/token.ts';
import { optionalToken } from '@packages/token/utils.ts';
import { SessionStore } from './index.ts';
import { USERS_API } from '../users-api/token.ts';
import { SESSION_STORE, SESSION_STORE_CFG } from './token.ts';

export const sessionStore = injectClass({
  token: SESSION_STORE,
  constructor: SessionStore,
  depends: {
    env: ENV,
    httpClient: HTTP_CLIENT,
    usersApi: USERS_API,
    config: optionalToken(SESSION_STORE_CFG),
  }
});
