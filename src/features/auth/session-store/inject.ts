import { injectClass, LOG_SERVICE } from 'react-solution';
import { ENV } from 'react-solution';
import { HTTP_CLIENT } from 'react-solution';
import { optionalToken } from 'react-solution';
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
    logger: LOG_SERVICE,
  },
});
