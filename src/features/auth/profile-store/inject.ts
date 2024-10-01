import { injectClass } from 'react-solution/container';
import { optionalToken } from 'react-solution/token';
import { ProfileStore } from './index.ts';
import { USERS_API } from '../users-api/token.ts';
import { PROFILE_STORE, PROFILE_STORE_CFG } from './token.ts';

export const profileStore = injectClass({
  token: PROFILE_STORE,
  constructor: ProfileStore,
  depends: {
    usersApi: USERS_API,
    config: optionalToken(PROFILE_STORE_CFG),
  },
});
