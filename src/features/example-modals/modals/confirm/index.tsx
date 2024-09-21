import { memo, useCallback } from 'react';
import ModalLayout from '@src/ui/layout/modal-layout';
import SideLayout from '@src/ui/layout/side-layout';
import { useTranslate } from '../../../../../packages/i18n';
import type { ModalWithClose } from '../../../../../packages/modals';

export interface ConfirmModalProps extends ModalWithClose<boolean> {
  title: string;
  message: string;
}

function ConfirmModal(props: ConfirmModalProps) {
  const t = useTranslate();
  const callbacks = {
    onSuccess: useCallback(() => props.close(true), []),
    onCancel: useCallback(() => props.close(false), []),
  };

  return (
    <ModalLayout onClose={callbacks.onCancel}>
      <h2>{props.title}</h2>
      <p>{props.message}</p>
      <SideLayout side="end">
        <button onClick={callbacks.onSuccess}>{t('example-modals.ok')}</button>
        <button onClick={callbacks.onCancel}>{t('example-modals.cancel')}</button>
      </SideLayout>
    </ModalLayout>
  );
}

export default memo(ConfirmModal);
