import { injectClass } from '../../packages/container';
import { Modals } from './service.ts';
import { MODALS } from './token.ts';

export const modalsService = injectClass({
  token: MODALS,
  constructor: Modals,
  depends: {},
});
