import { classProvider } from '../container';
import { optionalToken } from '../token';
import { LogService } from './service';
import { LOG_SERVICE, LOG_CFG } from './token';

export const logService = classProvider({
  token: LOG_SERVICE,
  constructor: LogService,
  depends: {
    config: optionalToken(LOG_CFG),
  },
});
