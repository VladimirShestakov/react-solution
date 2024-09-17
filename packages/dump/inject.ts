import { injectClass } from '@packages/container/utils.ts';
import { CONTAINER } from '@packages/container/token.ts';
import { optionalToken } from '@packages/token/utils.ts';
import { Dump } from './index.ts';
import { DUMP, DUMP_CFG } from './token.ts';

export const dump = injectClass({
  token: DUMP,
  constructor: Dump,
  depends: {
    container: CONTAINER,
    config: optionalToken(DUMP_CFG)
  }
});
