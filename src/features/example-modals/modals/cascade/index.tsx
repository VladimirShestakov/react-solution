import { memo, ReactNode, useCallback } from 'react';
import { useService } from 'react-solution';
import { useTranslate } from 'react-solution';
import { MODALS } from 'react-solution';
import type { ModalWithClose } from 'react-solution';
import ModalLayout from '@src/ui/layout/modal-layout';
import SideLayout from '@src/ui/layout/side-layout';
import { CASCADE_MODAL } from './token.ts';

export interface CascadeModalProps extends ModalWithClose<void> {
  title: string;
  message: string;
  level?: number;
}

function CascadeModal(props: CascadeModalProps): ReactNode {
  const t = useTranslate();
  const { level = 1 } = props;
  const modals = useService(MODALS);
  const openCascade = useCallback(() => {
    modals.open(CASCADE_MODAL, {
      title: t('example-modals.cascade.title'),
      message: `${t('example-modals.cascade.messageCount', { plural: level + 1 })} ${t('example-modals.cascade.message')}`,
      level: level + 1,
    });
  }, [level, t]);

  return (
    <ModalLayout onClose={props.close}>
      <h2>{props.title}</h2>
      <p>{props.message}</p>
      <p>
        <button onClick={openCascade}>{t('example-modals.cascade.openMore')}</button>
      </p>
      <SideLayout side="end">
        <button onClick={() => props.close()}>{t('example-modals.ok')}</button>
      </SideLayout>
    </ModalLayout>
  );
}

export default memo(CascadeModal);
