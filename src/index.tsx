import React from 'react';
import type { Patch } from 'react-solution';
import {
  Container,
  commonSolutions,
  RouterProvider,
  RENDER_COMPONENT,
  RENDER_SERVICE,
  ROUTER_SERVICE,
} from 'react-solution';

import { authFeature } from '@src/features/auth/injections.ts';
import { catalogFeature } from '@src/features/catalog/injections.ts';
import { exampleI18nFeature } from '@src/features/example-i18n/injections.ts';
import { exampleModalsFeature } from '@src/features/example-modals/injections.ts';
import { mainFeature } from '@src/features/main/injections.ts';
import { navigationFeature } from '@src/features/navigation/injections.ts';
import { configs } from './configs.ts';
import { App } from '@src/app';

/**
 * Создание DI контейнера для клиентского приложения (с настройками, сервисами, фичами...).
 * @param envPatch Патч на переменные окружения для возможности подставить параметры запроса при SSR
 */
async function getSolutions(envPatch: Patch<Env> = {}): Promise<Container> {
  return (
    new Container()
      // Настройки для всех сервисов
      .set(configs)
      // Общие сервисы
      .set(commonSolutions(envPatch))
      // Фичи проекта
      .set(authFeature)
      .set(exampleI18nFeature)
      .set(exampleModalsFeature)
      .set(catalogFeature)
      .set(mainFeature)
      .set(navigationFeature)
      // React компонент для рендера
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
