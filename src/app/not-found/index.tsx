import { useService } from 'react-solution';
import { ROUTER_SERVICE } from 'react-solution';
import { useInit, useUninit } from 'react-solution';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import Head from '@src/ui/layout/head';
import MainMenu from '@src/features/navigation/components/main-menu';
import PageLayout from '@src/ui/layout/page-layout';

function NotFound() {
  const routerService = useService(ROUTER_SERVICE);
  // Установка HTTP статуса для корректного рендера на сервере
  useInit(() => routerService.setHttpStatus(404), [], { ssr: 'Not found page' });
  // При переходе к другим страницам сбросить http status
  useUninit(() => routerService.resetHttpStatus());

  return (
    <PageLayout>
      <Head title="React Solution"></Head>
      <MainMenu />
      <h2>404</h2>
      <p>Страница не найдена</p>
      <Link to="/">На главную</Link>
    </PageLayout>
  );
}

export default memo(NotFound);
