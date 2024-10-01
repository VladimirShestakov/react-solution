import { newToken } from 'react-solution/token';
import type PromptModal from './index.tsx';

export const PROMPT_MODAL = newToken<typeof PromptModal>('@project/example-modals/prompt');
