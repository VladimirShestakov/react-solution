import { injectFabric } from '../container/utils.ts';
import { ViteDev } from './index.ts';
import { ENV } from '../env/token.ts';
import { VITE_DEV } from './token.ts';

export const viteDev = injectFabric({
  token: VITE_DEV,
  fabric: async (depends) => {
    return new ViteDev(depends).init();
  },
  depends: {
    env: ENV
  }
});
