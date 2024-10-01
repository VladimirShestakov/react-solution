import { HTTP_CLIENT } from 'react-solution/http-client';
import { injectClass } from 'react-solution/container';
import { optionalToken } from 'react-solution/token';
import { UsersApi } from './index.ts';
import { USERS_API, USERS_API_CFG } from './token.ts';

export const usersApi = injectClass({
  token: USERS_API,
  constructor: UsersApi,
  depends: {
    httpClient: HTTP_CLIENT,
    config: optionalToken(USERS_API_CFG),
  },
});
