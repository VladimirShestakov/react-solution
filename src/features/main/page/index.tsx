import { memo } from 'react';
import { useI18n } from 'react-solution';
import PageLayout from '@src/ui/layout/page-layout';
import Head from '@src/ui/layout/head';
import MainMenu from '@src/features/navigation/components/main-menu';
import LocaleSelect from '@src/features/example-i18n/components/locale-select';

function Main() {
  const { t } = useI18n();

  return (
    <PageLayout>
      <Head title="React Solution">
        <LocaleSelect />
      </Head>
      <MainMenu />
      <h2>{t('main.page.title')}</h2>
      <p>{t('main.page.content')}</p>
    </PageLayout>
  );
}

export default memo(Main);
