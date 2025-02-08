import { valueProvider } from 'react-solution';
import { PAGE_AS_MODAL } from '@src/features/example-modals/page/token.ts';
import PageAsModal from './index.tsx';

export const pageAsModal = valueProvider({
  token: PAGE_AS_MODAL,
  value: PageAsModal,
});
