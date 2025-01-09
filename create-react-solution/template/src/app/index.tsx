import { memo, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { Head, ModalsContainer } from 'react-solution';

export const App = memo(() => {
  return (
    <>
      <Head>
        <html lang="ru" />
        <title>React Solution!</title>
        <meta name="description" content="React solution" />
      </Head>
      <Suspense fallback={<div>Подождите...</div>}>
        <Routes>
          <Route path="/" index element={<div>Привет!</div>} />
          <Route path="*" element={<div>Страница не найдена</div>} />
        </Routes>
        <ModalsContainer />
      </Suspense>
    </>
  );
});
