import { newToken } from '../token';
import { HttpClientOptions, HttpClient } from './types.ts';

export const HTTP_CLIENT = newToken<HttpClient>('@react-solution/http-client');

export const HTTP_CLIENT_CFG = newToken<Patch<HttpClientOptions>>(
  '@react-solution/http-client/configs',
);
