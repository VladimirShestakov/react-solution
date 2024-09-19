import { Container, ContainerProvider } from '../packages/container';
import { dumpService } from '../packages/dump';
import { i18nService } from '../packages/i18n/inject.ts';
import { modalsService } from '../packages/modals/inject.ts';
import { renderService, RENDER_SERVICE, type RenderService } from '../packages/render';
import { routerService, ROUTER_SERVICE } from '../packages/router';
import { authFeature } from '@src/features/auth/injections.ts';
import { catalogFeature } from '@src/features/catalog/injections.ts';
import { exampleI18nFeature } from '@src/features/example-i18n/injections.ts';
import { exampleModalsFeature } from '@src/features/example-modals/injections.ts';
import { mainFeature } from '@src/features/main/injections.ts';
import { navigationFeature } from '@src/features/navigation/injections.ts';
import React from 'react';
import { HelmetProvider, HelmetServerState } from 'react-helmet-async';
import RouterProvider from '../packages/router/provider';
import App from '@src/app';
import { envClient } from '../packages/env/client.ts';
import { httpClient } from '../packages/http-client/inject.ts';
import config from './config.ts';

export default async function root(envPatch: Patch<ImportMetaEnv> = {}): Promise<RenderService> {

  const container = new Container()
    // Переменные окружения для фронта
    .set(envClient(envPatch))
    // Настройки для всех сервисов
    .set(config)
    // Общие сервисы
    .set([
      httpClient,
      i18nService,
      routerService,
      modalsService,
      dumpService,
      renderService
    ])
    // Функции проекта
    .set(authFeature)
    .set(exampleI18nFeature)
    .set(exampleModalsFeature)
    .set(catalogFeature)
    .set(mainFeature)
    .set(navigationFeature);

  const render = await container.get(RENDER_SERVICE);
  const router = await container.get(ROUTER_SERVICE);
  // Контекст для Helmet
  const helmetCtx = {} as { helmet: HelmetServerState };

  render.setReactElement(
    <ContainerProvider container={container}>
      <RouterProvider router={router}>
        <HelmetProvider context={helmetCtx}>
          <App/>
        </HelmetProvider>
      </RouterProvider>
    </ContainerProvider>
  );

  // Установки в результат рендера
  render.setServerValues({
    httpStatus: () => router.getHttpStatus(),
    htmlAttributes: () => helmetCtx.helmet.htmlAttributes.toString(),
    bodyAttributes: () => helmetCtx.helmet.bodyAttributes.toString(),
    title: () => helmetCtx.helmet.title.toString(),
    head: () => (
      helmetCtx.helmet.meta.toString() +
      helmetCtx.helmet.link.toString() +
      helmetCtx.helmet.script.toString() +
      helmetCtx.helmet.noscript.toString() +
      helmetCtx.helmet.style.toString()
    ),
  });

  return render;
}
