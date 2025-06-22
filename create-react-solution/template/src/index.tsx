import {
  Solutions,
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
} from 'react-solution';
import type { Patch } from 'merge-change';

import { configs } from './configs.ts';
import { App } from '@src/app';

/**
 * Создание DI контейнера с программными решениями (с настройками, сервисами, фичами...).
 * Подготовленный контейнер используется как для клиентского приложения, так и для рендера на сервере
 * @param envPatch Патч на переменные окружения для возможности подставить параметры запроса при SSR
 */
export default async function prepareSolutions(envPatch: Patch<Env> = {}): Promise<Solutions> {
  return new Solutions()
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
            <App />
          </RouterContextProvider>
        );
      },
    });
}

/**
 * Запуск рендеринга приложения в браузере.
 */
if (!import.meta.env.SSR) {
  (async () => {
    const solutions = await prepareSolutions();
    const render = await solutions.get(RENDER_SERVICE);
    render.start();
  })();
}
