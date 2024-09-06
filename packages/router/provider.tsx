import React, { useEffect, useState } from 'react';
import { Router as ReactRouter } from 'react-router-dom';
import { Router } from './index';

/**
 * Провайдер для роутера вместо <BrowserRouter> <MemoryRouter>
 * @param navigation
 * @param children
 * @return {JSX.Element}
 */
function RouterProvider({ router, children }: {
  router: Router,
  children: React.ReactNode
}) {
  const [state, setState] = useState({
    location: router.history.location,
    action: router.history.action,
  });

  // // Подписка на изменение навигации
  useEffect(() => {
    return router.history.listen((newState: any) => {
      setState(newState);
    });
  }, []);

  return (
    <ReactRouter
      navigationType={state.action}
      location={state.location}
      basename={router.basename}
      navigator={router.history}
    >
      {children}
    </ReactRouter>
  );
}

export default React.memo(RouterProvider);
