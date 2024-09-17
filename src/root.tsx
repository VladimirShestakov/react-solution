import { dump } from '@packages/dump/inject.ts';
import { DUMP } from '@packages/dump/token.ts';
import { i18n } from '@packages/i18n/inject.ts';
import { modals } from '@packages/modals/inject.ts';
import { router } from '@packages/router/inject.ts';
import { ROUTER } from '@packages/router/token.ts';
import { authFeature } from '@src/features/auth/injections.ts';
import { catalogFeature } from '@src/features/catalog/injections.ts';
import { exampleI18nFeature } from '@src/features/example-i18n/injections.ts';
import { exampleModalsFeature } from '@src/features/example-modals/injections.ts';
import { mainFeature } from '@src/features/main/injections.ts';
import { navigationFeature } from '@src/features/navigation/injections.ts';
import mc from 'merge-change';
import React from 'react';
import { HelmetProvider, HelmetServerState } from 'react-helmet-async';
import RouterProvider from '@packages/router/provider';
import Services from '@src/services';
import App from '@src/app';
import ServicesProvider from '@src/services/provider';
import clientConfig from '@src/config';
import { Container } from '@packages/container';
import { ContainerProvider } from '../packages/container/provider.tsx';
import { envClient } from '../packages/env/client.ts';
import { httpClient } from '../packages/http-client/inject.ts';
import configs from './config-di.ts';

export default async function root(envPatch: Patch<ImportMetaEnv> = {}): Promise<RootFabricResult> {

  const container = new Container()
    // Переменные окружения для фронта
    .set(envClient(envPatch))
    // Настройки для всех сервисов
    .set(configs)
    // Общие сервисы
    .set(httpClient)
    .set(i18n)
    .set(router)
    .set(modals)
    .set(dump)
    // Функции проекта
    .set(authFeature)
    .set(exampleI18nFeature)
    .set(exampleModalsFeature)
    .set(catalogFeature)
    .set(mainFeature)
    .set(navigationFeature);

  await container.get(DUMP);

  const routerService = await container.get(ROUTER);

  const env: ImportMetaEnv = mc.merge(import.meta.env, envPatch);
  // Менеджер сервисов
  const servicesManager = new Services(env);
  // Через services получаем доступ к store, api, i18n и всем другим сервисам
  const services = await servicesManager.init(clientConfig(env));
  // Контекст для Helmet
  const helmetCtx = {} as { helmet: HelmetServerState };

  const Root = () => (
    <ContainerProvider container={container}>
      <ServicesProvider services={services}>
        <RouterProvider router={routerService}>
          <HelmetProvider context={helmetCtx}>
            <App/>
          </HelmetProvider>
        </RouterProvider>
      </ServicesProvider>
    </ContainerProvider>
  );

  const injections: ServerSideRenderInjections = {
    htmlAttr: () => helmetCtx.helmet.htmlAttributes.toString(),
    bodyAttr: () => helmetCtx.helmet.bodyAttributes.toString(),
    title: () => helmetCtx.helmet.title.toString(),
    head: () => {
      return helmetCtx.helmet.meta.toString() +
        helmetCtx.helmet.link.toString() +
        helmetCtx.helmet.script.toString() +
        helmetCtx.helmet.noscript.toString() +
        helmetCtx.helmet.style.toString();
    },
    dump: () => servicesManager.collectDump(),
    httpStatus: () => routerService.getHttpStatus()
  };

  return { Root, servicesManager, injections };
}
