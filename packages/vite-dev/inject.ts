import { injectFabric } from '../container';
import { ENV } from '../env';
import { VITE_DEV } from './token.ts';
import { ViteDev } from './service.ts';

export const viteDev = injectFabric({
  token: VITE_DEV,
  fabric: async depends => {
    return new ViteDev(depends).init();
  },
  depends: {
    env: ENV,
  },
});
