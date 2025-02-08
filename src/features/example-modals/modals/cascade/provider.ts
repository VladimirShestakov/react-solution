import { valueProvider } from 'react-solution';
import CascadeModal from './index.tsx';
import { CASCADE_MODAL } from './token.ts';

export const cascadeModal = valueProvider({
  token: CASCADE_MODAL,
  value: CascadeModal,
});
