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

/**
 * Создание DI контейнера с сервисами, фичами, настройками и прочими зависимостями.
 * DI контейнер является точкой доступа ко всем возможностями приложения.
 * @param envPatch Патч на переменные окружения для возможности подставить параметры запроса при SSR
 */
async function getSolutions(envPatch: Patch<Env> = {}): Promise<Container> {
  return new Container()
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
      factory: ({ router }) => {
        return (
          <RouterProvider router={router}>
            <div>Привет!</div>
          </RouterProvider>
        );
      },
    });
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
