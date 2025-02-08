import { profileStore } from './profile-store/provider';
import { sessionStore } from './session-store/provider';
import { translations } from './translations/provider';
import { usersApi } from './users-api/provider';

export const authFeature = [usersApi, profileStore, sessionStore, translations];
