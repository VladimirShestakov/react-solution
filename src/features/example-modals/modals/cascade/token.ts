import { newToken } from '@packages/token/utils.ts';
import type CascadeModal from './index.tsx';

export const CASCADE_MODAL = newToken<typeof CascadeModal>('@project/example-modals/cascade');
