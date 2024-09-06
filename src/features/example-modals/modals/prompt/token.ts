import { newToken } from '@packages/token/utils.ts';
import type PromptModal from './index.tsx';

export const PROMPT_MODAL = newToken<typeof PromptModal>('@project/example-modals/prompt');
