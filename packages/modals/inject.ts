import { injectClass } from '../container';
import { Modals } from './service';
import { MODALS } from './token';

export const modalsService = injectClass({
  token: MODALS,
  constructor: Modals,
  depends: {},
});
