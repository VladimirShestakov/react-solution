import { useI18n } from 'react-solution/i18n';
import { memo } from 'react';
import Head from '@src/ui/layout/head';
import MainMenu from '@src/features/navigation/components/main-menu';
import PageLayout from '@src/ui/layout/page-layout';
import LocaleSelect from '../components/locale-select';

function I18nExamplePage() {
  const { t } = useI18n();

  return (
    <PageLayout>
      <Head title="React Solution">
        <LocaleSelect />
      </Head>
      <MainMenu />
      <h2>{t('example-i18n.title')}</h2>
      <p>{t('example-i18n.content.pLocale')}</p>
      <p>{t('example-i18n.content.pDic')}</p>
      <p>{t('example-i18n.content.pDetect')}</p>
      <p>{t('example-i18n.content.pHook')}</p>
    </PageLayout>
  );
}

export default memo(I18nExamplePage);
