import { CONTAINER, injectClass } from '../../packages/container';
import { ENV } from '../../packages/env/token.ts';
import { Configs } from './index.ts';
import { CONFIGS } from './token.ts';

export const ConfigsInject = injectClass({
  token: CONFIGS,
  constructor: Configs,
  depends: {
    env: ENV,
    container: CONTAINER
  }
});
