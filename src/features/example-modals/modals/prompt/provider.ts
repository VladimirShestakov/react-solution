import { valueProvider } from 'react-solution';
import PromptModal from './index.tsx';
import { PROMPT_MODAL } from './token.ts';

export const promptModal = valueProvider({
  token: PROMPT_MODAL,
  value: PromptModal,
});
