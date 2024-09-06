import { injectClass } from '@packages/container/utils.ts';
import { Modals } from './index.ts';
import { MODALS } from './token.ts';

export const modals = injectClass({
  token: MODALS,
  constructor: Modals,
  depends: {}
});
