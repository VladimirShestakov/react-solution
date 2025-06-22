import { newToken } from '../token';
import type { Patch } from 'merge-change';
import { HttpClientOptions, HttpClient } from './types';

export const HTTP_CLIENT = newToken<HttpClient>('@react-solution/http-client');

export const HTTP_CLIENT_CFG = newToken<Patch<HttpClientOptions>>(
  '@react-solution/http-client/configs',
);
