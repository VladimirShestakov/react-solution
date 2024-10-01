import { injectClass } from 'react-solution/container';
import { ENV } from 'react-solution/env';
import { HTTP_CLIENT } from 'react-solution/http-client';
import { optionalToken } from 'react-solution/token';
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
  },
});
