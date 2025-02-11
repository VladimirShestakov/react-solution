import React, { memo, useCallback } from 'react';
import { useTranslate } from 'react-solution';
import { useSolution } from 'react-solution';
import { MODALS } from 'react-solution';
import Head from '@src/ui/layout/head';
import MainMenu from '@src/features/navigation/components/main-menu';
import PageLayout from '@src/ui/layout/page-layout';
import LocaleSelect from '@src/features/example-i18n/components/locale-select';
import { CASCADE_MODAL } from '../modals/cascade/token.ts';
import { CONFIRM_MODAL } from '../modals/confirm/token.ts';
import { MESSAGE_MODAL } from '../modals/message/token.ts';
import { PROMPT_MODAL } from '../modals/prompt/token.ts';
import { PAGE_AS_MODAL } from './token.ts';
import { Head as HeadMeta } from 'react-solution';

export interface PageAsModalProps {
  close?: () => void;
}

function PageAsModal(props: PageAsModalProps) {
  const t = useTranslate();
  const modals = useSolution(MODALS);

  const callbacks = {
    openMessage: useCallback(async () => {
      modals.open(MESSAGE_MODAL, {
        title: 'Сообщение',
        message: 'Простое окно с сообщением. Заголовок и текст переданы при открытии окна',
      });
    }, []),

    openConfirm: useCallback(async () => {
      const result = await modals.open(CONFIRM_MODAL, {
        title: 'Подтвердите действие!',
        message:
          'Вы действительно хотите выполнить некое действие? Ваш выбор отобразится в консоле браузера.',
      });
      console.log('confirm', result);
    }, []),

    openPrompt: useCallback(async () => {
      const result = await modals.open(PROMPT_MODAL, {
        title: 'Введите строку',
        message: 'Введенное значение отобразится в консоле браузера, если нажмете Ок.',
      });
      console.log('prompt', result);
    }, []),

    openCascade: useCallback(async () => {
      const result = await modals.open(CASCADE_MODAL, {
        title: t('example-modals.cascade.title'),
        message: `${t('example-modals.cascade.messageCount', { plural: 1 })} ${t('example-modals.cascade.message')}`,
      });
      console.log('cascade', result);
    }, []),

    openPage: useCallback(async () => {
      modals.open(PAGE_AS_MODAL);
    }, []),

    onClose: useCallback(() => {
      if (props.close) props.close();
    }, [props.close]),
  };

  return (
    <PageLayout>
      <HeadMeta>
        <title>Модалки!</title>
        <base href={'/345345353'} />
        <link rel="icon" type="image/x-icon" href="/test/test/favicon.ico" />
      </HeadMeta>

      <Head title="React Solution">
        {props.close ? <button onClick={callbacks.onClose}>Закрыть</button> : <LocaleSelect />}
      </Head>
      <MainMenu />
      <h2>{t('example-modals.title')}</h2>
      <p>{t('example-modals.content.first')}</p>
      <p>{t('example-modals.content.second')}</p>
      <p>
        <button onClick={callbacks.openMessage}>Сообщение</button>
      </p>
      <p>
        <button onClick={callbacks.openConfirm}>Подтверждение</button>
      </p>
      <p>
        <button onClick={callbacks.openPrompt}>Запрос значения</button>
      </p>
      <p>
        <button onClick={callbacks.openCascade}>Каскад окон</button>
      </p>
      <p>{t('example-modals.content.example')}</p>
      <p>
        <button onClick={callbacks.openPage}>{t('example-modals.content.openPage')}</button>
      </p>
    </PageLayout>
  );
}

export default memo(PageAsModal);
