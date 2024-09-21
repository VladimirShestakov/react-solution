import { injectValue } from '../../../../../packages/container';
import PromptModal from './index.tsx';
import { PROMPT_MODAL } from './token.ts';

export const promptModal = injectValue({
  token: PROMPT_MODAL,
  value: PromptModal,
});
