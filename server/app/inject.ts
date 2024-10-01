import { injectClass } from 'react-solution/container';
import { PROXY } from 'react-solution/proxy';
import { ENV } from 'react-solution/env';
import { VITE_DEV } from 'react-solution/vite-dev';
import { SSR } from 'react-solution/ssr';
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
