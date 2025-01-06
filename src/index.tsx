import React from 'react';
import {
  Container,
  RouterProvider,
  envClient,
  RENDER_COMPONENT,
  RENDER_SERVICE,
  ROUTER_SERVICE,
  dumpService,
  httpClient,
  i18nService,
  logService,
  modalsService,
  renderService,
  routerService,
  type Patch,
} from 'react-solution';

import { configs } from './configs.ts';
import { App } from '@src/app';

/**
 * Создание DI контейнера для клиентского приложения (с настройками, сервисами, фичами...).
 * @param envPatch Патч на переменные окружения для возможности подставить параметры запроса при SSR
 */
async function getSolutions(envPatch: Patch<Env> = {}): Promise<Container> {
  return (
    new Container()
      .set(envClient(envPatch))
      .set(configs)
      .set(renderService)
      .set(routerService)
      .set(modalsService)
      .set(httpClient)
      .set(i18nService)
      .set(logService)
      .set(dumpService)
      // Инъекция React компонента для сервиса рендера
      .set({
        token: RENDER_COMPONENT,
        depends: { router: ROUTER_SERVICE },
        factory: ({ router }) => (
          <RouterProvider router={router}>
            <App />
          </RouterProvider>
        ),
      })
  );
}

/**
 * Запуск рендера в браузере.
 */
if (!import.meta.env.SSR) {
  (async () => {
    const solutions = await getSolutions();
    const render = await solutions.get(RENDER_SERVICE);
    render.start();
  })();
}

/**
 * Экспорт функции для SSR.
 */
export default getSolutions;
