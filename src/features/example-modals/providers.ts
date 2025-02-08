import { cascadeModal } from './modals/cascade/provider';
import { confirmModal } from './modals/confirm/provider';
import { messageModal } from './modals/message/provider';
import { promptModal } from './modals/prompt/provider';
import { pageAsModal } from './page/provider';
import { translations } from './translations/provider';

export const exampleModalsFeature = [
  translations,
  confirmModal,
  cascadeModal,
  messageModal,
  promptModal,
  pageAsModal,
];
