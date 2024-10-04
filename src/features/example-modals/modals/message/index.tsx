import { memo } from 'react';
import { useTranslate } from 'react-solution';
import type { ModalWithClose } from 'react-solution';
import ModalLayout from '@src/ui/layout/modal-layout';
import SideLayout from '@src/ui/layout/side-layout';

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
