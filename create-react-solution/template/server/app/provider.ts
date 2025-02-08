import { classProvider, ENV } from 'react-solution';
import { PROXY, VITE_DEV, SSR } from 'react-solution/server';
import { APP, APP_CFG } from './token.ts';
import { App } from './index.ts';

export const app = classProvider({
  token: APP,
  constructor: App,
  depends: {
    env: ENV,
    config: APP_CFG,
    proxy: PROXY,
    vite: VITE_DEV,
    ssr: SSR,
  },
});
