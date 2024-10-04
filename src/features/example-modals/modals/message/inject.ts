import { injectValue } from 'react-solution';
import MessageModal from './index.tsx';
import { MESSAGE_MODAL } from './token.ts';

export const messageModal = injectValue({
  token: MESSAGE_MODAL,
  value: MessageModal,
});
