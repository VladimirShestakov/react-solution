import { HTTP_CLIENT } from 'react-solution';
import { injectClass } from 'react-solution';
import { optionalToken } from 'react-solution';
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
