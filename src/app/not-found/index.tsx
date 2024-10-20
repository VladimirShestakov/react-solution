import { HttpStatus } from 'react-solution';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import Head from '@src/ui/layout/head';
import MainMenu from '@src/features/navigation/components/main-menu';
import PageLayout from '@src/ui/layout/page-layout';

function NotFound() {
  return (
    <PageLayout>
      <HttpStatus>404</HttpStatus>
      <Head title="React Solution"></Head>
      <MainMenu />
      <h2>404</h2>
      <p>Страница не найдена</p>
      <Link to="/">На главную</Link>
    </PageLayout>
  );
}

export default memo(NotFound);
