import React, { lazy, memo, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Head, ModalsContainer } from 'react-solution';
import Loading from '@src/app/loading';
import Protected from '@src/features/auth/components/protected';
import ExampleCanvasPage from '@src/features/example-canvas/page';

// Синхронный импорт
// import Main from '@src/features/main/page';
// import Login from '@src/features/auth/pages/login';
// import Catalog from '@src/features/catalog/page';
// import NotFound from '@src/app/not-found';

// Динамический импорт станиц
const Main = lazy(() => import('@src/features/main/page'));
const Login = lazy(() => import('@src/features/auth/pages/login'));
const Catalog = lazy(() => import('@src/features/catalog/page'));
const Profile = lazy(() => import('@src/features/auth/pages/profile'));
const NotFound = lazy(() => import('@src/app/not-found'));
const ExampleModals = lazy(() => import('@src/features/example-modals/page'));
const ExampleI18n = lazy(() => import('@src/features/example-i18n/page'));

declare global {
  interface HTMLTitleElement {
    values: Record<string, string | number>;
  }
}

export const App = memo(() => {
  return (
    <>
      <Head>
        <html lang="en" />
        <title>React Solution!</title>
        <meta name="description" content="React solution" />
      </Head>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" index element={<Main />} />
          <Route path="/example-modals" index element={<ExampleModals />} />
          <Route path="/example-i18n" index element={<ExampleI18n />} />
          <Route path="/example-canvas" index element={<ExampleCanvasPage />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:categoryId" element={<Catalog />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <Protected redirect="/login">
                <Profile />
              </Protected>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ModalsContainer />
      </Suspense>
    </>
  );
});
