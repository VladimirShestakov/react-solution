import { injectValue } from '../../../../../packages/container';
import CascadeModal from './index.tsx';
import { CASCADE_MODAL } from './token.ts';

export const cascadeModal = injectValue({
  token: CASCADE_MODAL,
  value: CascadeModal,
});