import { injectFabric } from '../container';
import { ENV } from '../env';
import { VITE_DEV } from './token';
import { ViteDev } from './service';

export const viteDev = injectFabric({
  token: VITE_DEV,
  fabric: async depends => {
    return new ViteDev(depends).init();
  },
  depends: {
    env: ENV,
  },
});
