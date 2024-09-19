import { newToken } from '../../packages/token';
import { HttpClientOptions, HttpClient } from './types.ts';

export const HTTP_CLIENT = newToken<HttpClient>('@react-skeleton/http-client');

export const HTTP_CLIENT_CFG = newToken<Patch<HttpClientOptions>>('@react-skeleton/http-client/configs');

