import { injectClass } from 'react-solution';
import { PROXY } from 'react-solution/server';
import { ENV } from 'react-solution';
import { VITE_DEV } from 'react-solution/server';
import { SSR } from 'react-solution/server';
import { APP, APP_CFG } from './token.ts';
import { App } from './index.ts';

export const app = injectClass({
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
