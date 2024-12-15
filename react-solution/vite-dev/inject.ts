import { injectFactory } from '../container';
import { ENV } from '../env';
import { VITE_DEV } from './token';
import { ViteDev } from './service';

export const viteDev = injectFactory({
  token: VITE_DEV,
  factory: async depends => {
    return new ViteDev(depends).init();
  },
  depends: {
    env: ENV,
  },
});