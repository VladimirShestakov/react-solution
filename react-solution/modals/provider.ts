import { classProvider } from '../container';
import { Modals } from './service';
import { MODALS } from './token';

export const modalsService = classProvider({
  token: MODALS,
  constructor: Modals,
  depends: {},
});
