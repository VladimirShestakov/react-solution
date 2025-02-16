import { SOLUTIONS, classProvider } from '../solutions';
import { optionalToken } from '../token';
import { ENV } from '../env';
import { DumpService } from './service';
import { DUMP_SERVICE, DUMP_CFG } from './token';

export const dumpService = classProvider({
  token: DUMP_SERVICE,
  constructor: DumpService,
  depends: {
    env: ENV,
    solutions: SOLUTIONS,
    config: optionalToken(DUMP_CFG),
  },
});
