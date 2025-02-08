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
import { authFeature } from '@src/features/auth/providers.ts';
import { exampleI18nFeature } from '@src/features/example-i18n/providers.ts';
import { exampleModalsFeature } from '@src/features/example-modals/providers.ts';
import { catalogFeature } from '@src/features/catalog/providers.ts';
import { mainFeature } from '@src/features/main/providers.ts';
import { navigationFeature } from '@src/features/navigation/providers.ts';

/**
 * Создание DI контейнера для клиентского приложения (с настройками, сервисами, фичами...).
 * @param envPatch Патч на переменные окружения для возможности подставить параметры запроса при SSR
 */
async function getSolutions(envPatch: Patch<Env> = {}): Promise<Container> {
  return (
    new Container()
      .register(envClient(envPatch))
      .register(configs)
      .register(renderService)
      .register(routerService)
      .register(modalsService)
      .register(httpClient)
      .register(i18nService)
      .register(logService)
      .register(dumpService)
      // Фичи проекта
      .register(authFeature)
      .register(exampleI18nFeature)
      .register(exampleModalsFeature)
      .register(catalogFeature)
      .register(mainFeature)
      .register(navigationFeature)
      // Провайдер React компонента для сервиса рендеринга
      .register({
        token: RENDER_COMPONENT,
        depends: { router: ROUTER_SERVICE },
        factory: ({ router }) => (
          <RouterContextProvider router={router}>
            <App />
          </RouterContextProvider>
        ),
      })
  );
}

/**
 * Запуск рендеринга приложения в браузере.
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
