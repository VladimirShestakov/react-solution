import { useService } from '../../../packages/container';
import { ROUTER_SERVICE } from '../../../packages/router';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import Head from '@src/ui/layout/head';
import MainMenu from '@src/features/navigation/components/main-menu';
import PageLayout from '@src/ui/layout/page-layout';
import { useInit, useUninit } from '../../../packages/render';

function NotFound() {
  const routerService = useService(ROUTER_SERVICE);
  // Установка HTTP статуса для корректного рендера на сервере
  useInit(() => routerService.setHttpStatus(404), [], { ssr: 'Not found page' });
  // При переходе к другим страницам сбросить http status
  useUninit(() => routerService.resetHttpStatus());

  return (
    <PageLayout>
      <Head title="React Skeleton"></Head>
      <MainMenu />
      <h2>404</h2>
      <p>Страница не найдена</p>
      <Link to="/">На главную</Link>
    </PageLayout>
  );
}

export default memo(NotFound);
