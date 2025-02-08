import {
  Container,
  RouterContextProvider,
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
 * @param envPatch Патч на переменные
 */
export default async function createSolutions(envPatch: Patch<Env> = {}): Promise<Container> {
  return new Container()
    .register(envClient(envPatch))
    .register(configs)
    .register(renderService)
    .register(routerService)
    .register(modalsService)
    .register(httpClient)
    .register(i18nService)
    .register(logService)
    .register(dumpService)
    .register({
      token: RENDER_COMPONENT,
      depends: { router: ROUTER_SERVICE },
      factory: ({ router }) => {
        return (
          <RouterContextProvider router={router}>
            <App/>
          </RouterContextProvider>
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
