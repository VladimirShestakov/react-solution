import { memo, ReactNode, useCallback, useState } from 'react';
import ModalLayout from '@src/ui/layout/modal-layout';
import SideLayout from '@src/ui/layout/side-layout';
import { useTranslate } from '../../../../../packages/i18n';
import type { ModalWithClose } from '../../../../../packages/modals';

export interface PromptModalProps extends ModalWithClose<string | null> {
  title: string;
  message: string;
}

function PromptModal(props: PromptModalProps): ReactNode {
  const t = useTranslate();
  const [value, setValue] = useState('');
  const callbacks = {
    onSuccess: useCallback(() => props.close(value), [value]),
    onCancel: useCallback(() => props.close(null), []),
  };

  return (
    <ModalLayout onClose={callbacks.onCancel}>
      <h2>{props.title}</h2>
      <p>
        <input type="text" value={value} onChange={e => setValue(e.target.value)} />
      </p>
      <p>{props.message}</p>
      <SideLayout side="end">
        <button onClick={callbacks.onSuccess}>{t('example-modals.ok')}</button>
        <button onClick={callbacks.onCancel}>{t('example-modals.cancel')}</button>
      </SideLayout>
    </ModalLayout>
  );
}

export default memo(PromptModal);
