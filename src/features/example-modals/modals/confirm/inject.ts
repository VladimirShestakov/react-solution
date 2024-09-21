import { injectValue } from '../../../../../packages/container';
import ConfirmModal from './index.tsx';
import { CONFIRM_MODAL } from './token.ts';

export const confirmModal = injectValue({
  token: CONFIRM_MODAL,
  value: ConfirmModal,
});
