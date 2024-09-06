import { profileStore } from './profile-store/inject.ts';
import { sessionStore } from './session-store/inject.ts';
import { injectTranslations } from './translations/ingect.ts';
import { usersApi } from './users-api/inject.ts';

export const authFeature = [
  usersApi,
  profileStore,
  sessionStore,
  injectTranslations
];
