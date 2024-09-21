import { CONTAINER, injectClass } from '../../packages/container';
import { DUMP_SERVICE } from '../../packages/dump';
import { optionalToken } from '../../packages/token';
import { ENV } from '../../packages/env';
import { RenderService } from './service.ts';
import { RENDER_SERVICE, RENDER_CFG } from './token.ts';

export const renderService = injectClass({
  token: RENDER_SERVICE,
  constructor: RenderService,
  depends: {
    env: ENV,
    container: CONTAINER,
    dump: optionalToken(DUMP_SERVICE),
    config: optionalToken(RENDER_CFG),
  },
});
