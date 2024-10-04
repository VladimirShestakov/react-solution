import { CONTAINER, injectClass } from '../container';
import { optionalToken } from '../token';
import { ENV } from '../env';
import { DumpService } from './service';
import { DUMP_SERVICE, DUMP_CFG } from './token';

export const dumpService = injectClass({
  token: DUMP_SERVICE,
  constructor: DumpService,
  depends: {
    env: ENV,
    container: CONTAINER,
    config: optionalToken(DUMP_CFG),
  },
});
