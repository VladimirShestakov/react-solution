import { newToken } from '@packages/token/utils.ts';
import type PageAsModal from './index.tsx';

export const PAGE_AS_MODAL = newToken<typeof PageAsModal>('@project/example-modals/page-as-modal');
