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
 * Создание DI контейнера с сервисами, фичами, настройками и прочими зависимостями приложения.
 * DI контейнер является точкой доступа ко всем возможностями приложения.
 * @param envPatch Патч на переменные окружения для возможности подставить параметры запроса при SSR
 */
export default async function createSolutions(envPatch: Patch<Env> = {}): Promise<Container> {
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
    .set({
      token: RENDER_COMPONENT,
      depends: { router: ROUTER_SERVICE },
      factory: ({ router }) => {
        return (
          <RouterProvider router={router}>
            <App/>
          </RouterProvider>
        );
      },
    });
}

/**
 * Запуск рендера в браузере.
 * Рендер на сервере реализуется в ./server сервисом ssr
 */
if (!import.meta.env.SSR) {
  (async () => {
    const solutions = await createSolutions();
    const render = await solutions.get(RENDER_SERVICE);
    render.start();
  })();
}
