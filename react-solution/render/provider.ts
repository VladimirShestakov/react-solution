import { SOLUTIONS, classProvider } from '../solutions';
import { DUMP_SERVICE } from '../dump';
import { LOG_SERVICE } from '../log';
import { optionalToken } from '../token';
import { ENV } from '../env';
import { RenderService } from './service';
import { RENDER_SERVICE, RENDER_CFG, RENDER_COMPONENT } from './token';

export const renderService = classProvider({
  token: RENDER_SERVICE,
  constructor: RenderService,
  depends: {
    env: ENV,
    solutions: SOLUTIONS,
    logger: LOG_SERVICE,
    dump: optionalToken(DUMP_SERVICE),
    config: optionalToken(RENDER_CFG),
    children: optionalToken(RENDER_COMPONENT),
  },
});
