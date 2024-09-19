import { CONTAINER, injectClass } from '../../packages/container';
import { optionalToken } from '../../packages/token';
import { ENV } from '../env/token.ts';
import { DumpService } from './service.ts';
import { DUMP_SERVICE, DUMP_CFG } from './token.ts';

export const dumpService = injectClass({
  token: DUMP_SERVICE,
  constructor: DumpService,
  depends: {
    env: ENV,
    container: CONTAINER,
    config: optionalToken(DUMP_CFG)
  }
});
