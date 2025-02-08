import { classProvider } from '../container';
import { HttpClient } from './service';
import { HTTP_CLIENT, HTTP_CLIENT_CFG } from './token';

export const httpClient = classProvider({
  token: HTTP_CLIENT,
  constructor: HttpClient,
  depends: {
    config: HTTP_CLIENT_CFG,
  },
});
