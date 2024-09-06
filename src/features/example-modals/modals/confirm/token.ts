import { newToken } from '@packages/token/utils.ts';
import type ConfirmModal from './index.tsx';

export const CONFIRM_MODAL = newToken<typeof ConfirmModal>('@project/example-modals/confirm');


