import { injectClass } from '../../packages/container';
import { PROXY } from '../../packages/proxy';
import { ENV } from '../../packages/env';
import { VITE_DEV } from '../../packages/vite-dev';
import { SSR } from '../../packages/ssr';
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
