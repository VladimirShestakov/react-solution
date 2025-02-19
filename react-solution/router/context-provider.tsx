import React, { useEffect, useState } from 'react';
import { Router } from 'react-router-dom';
import type { RouterService } from './service';

/**
 * Провайдер для роутера вместо <BrowserRouter> <MemoryRouter>
 * @param navigation
 * @param children
 * @return {JSX.Element}
 */
export function RouterContextProvider({
  router,
  children,
}: {
  router: RouterService;
  children: React.ReactNode;
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
    <Router
      navigationType={state.action}
      location={state.location}
      basename={router.basename}
      navigator={router.history}
    >
      {children}
    </Router>
  );
}

export const RouterContextProviderMemo = React.memo(RouterContextProvider);
