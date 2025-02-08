import { valueProvider } from 'react-solution';
import ConfirmModal from './index.tsx';
import { CONFIRM_MODAL } from './token.ts';

export const confirmModal = valueProvider({
  token: CONFIRM_MODAL,
  value: ConfirmModal,
});
