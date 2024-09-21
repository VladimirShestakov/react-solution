import { cascadeModal } from './modals/cascade/inject.ts';
import { confirmModal } from './modals/confirm/inject.ts';
import { messageModal } from './modals/message/inject.ts';
import { promptModal } from './modals/prompt/inject.ts';
import { pageAsModal } from './page/inject.ts';
import { injectTranslations } from './translations/ingect.ts';

export const exampleModalsFeature = [
  injectTranslations,
  confirmModal,
  cascadeModal,
  messageModal,
  promptModal,
  pageAsModal,
];
