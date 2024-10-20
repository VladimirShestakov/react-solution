import { CONTAINER, injectClass } from '../container';
import { DUMP_SERVICE } from '../dump';
import { META_DOM_SERVICE } from '../meta-dom';
import { optionalToken } from '../token';
import { ENV } from '../env';
import { RenderService } from './service';
import { RENDER_SERVICE, RENDER_CFG, RENDER_COMPONENT } from './token';

export const renderService = injectClass({
  token: RENDER_SERVICE,
  constructor: RenderService,
  depends: {
    env: ENV,
    container: CONTAINER,
    dump: optionalToken(DUMP_SERVICE),
    meta: optionalToken(META_DOM_SERVICE),
    config: optionalToken(RENDER_CFG),
    children: optionalToken(RENDER_COMPONENT)
  },
});
