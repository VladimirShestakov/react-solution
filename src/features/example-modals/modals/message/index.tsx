import { memo } from 'react';
import ModalLayout from '@src/ui/layout/modal-layout';
import SideLayout from '@src/ui/layout/side-layout';
import { useTranslate } from '../../../../../packages/i18n/use-i18n.ts';
import type { ModalWithClose } from '../../../../../packages/modals/types';

export interface MessageModalProps extends ModalWithClose<void> {
  title: string;
  message: string;
}

function MessageModal(props: MessageModalProps) {
  const t = useTranslate();
  return (
    <ModalLayout onClose={props.close}>
      <h2>{props.title}</h2>
      <p>{props.message}</p>
      <SideLayout side="end">
        <button onClick={() => props.close()}>{t('example-modals.ok')}</button>
      </SideLayout>
    </ModalLayout>
  );
}

export default memo(MessageModal);
