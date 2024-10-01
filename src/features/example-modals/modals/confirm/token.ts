import { newToken } from 'react-solution/token';
import type ConfirmModal from './index.tsx';

export const CONFIRM_MODAL = newToken<typeof ConfirmModal>('@project/example-modals/confirm');
