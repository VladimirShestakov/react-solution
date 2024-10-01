import { newToken } from 'react-solution/token';
import type MessageModal from './index.tsx';

export const MESSAGE_MODAL = newToken<typeof MessageModal>('@project/example-modals/message');
