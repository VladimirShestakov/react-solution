import { CONTAINER, injectClass } from '../container';
import { DUMP_SERVICE } from '../dump';
import { optionalToken } from '../token';
import { ENV } from '../env';
import { RenderService } from './service';
import { RENDER_SERVICE, RENDER_CFG } from './token';

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
