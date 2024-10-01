import React from 'react';
import { HelmetProvider, HelmetServerState } from 'react-helmet-async';
import {
  commonClient,
  envClient,
  Container,
  ContainerProvider,
  RouterProvider,
  RENDER_SERVICE,
  ROUTER_SERVICE,
  type RenderService,
} from 'react-solution';
import { authFeature } from '@src/features/auth/injections.ts';
import { catalogFeature } from '@src/features/catalog/injections.ts';
import { exampleI18nFeature } from '@src/features/example-i18n/injections.ts';
import { exampleModalsFeature } from '@src/features/example-modals/injections.ts';
import { mainFeature } from '@src/features/main/injections.ts';
import { navigationFeature } from '@src/features/navigation/injections.ts';
import App from '@src/app';
import config from './config.ts';

/**
 * Создание клиентского приложения.
 * Экспортируется функция создания приложения, чтобы при SSR на каждый запрос создавать изолированные приложения.
 * На клиенте приложение создаётся в единственном экземпляре в файле index.ts
 * @param envPatch Патч на переменные окружения. Используется при SSR, чтобы подставить параметры запроса
 */
export default async function clientApp(
  envPatch: Patch<ImportMetaEnv> = {},
): Promise<RenderService> {
  // Все используемые сервисы, модули, ресурсы и прочее регистрируется в контейнере DI.
  const container = new Container()
    // Переменные окружения для фронта
    .set(envClient(envPatch))
    // Настройки для всех сервисов
    .set(config)
    // Общие сервисы
    .set(commonClient)
    // Функции проекта
    .set(
      authFeature,
      exampleI18nFeature,
      exampleModalsFeature,
      catalogFeature,
      mainFeature,
      navigationFeature,
    );

  // Из контейнера берем экземпляр сервиса для рендера.
  // Устанавливаем ему React элемент.
  // React элемент можно обернуть в провайдеры, а провайдерам передать соответсвующее сервисы.
  const render = await container.get(RENDER_SERVICE);
  const router = await container.get(ROUTER_SERVICE);
  // Контекст для Helmet
  const helmetCtx = {} as { helmet: HelmetServerState };

  render.setReactElement(
    <ContainerProvider container={container}>
      <RouterProvider router={router}>
        <HelmetProvider context={helmetCtx}>
          <App />
        </HelmetProvider>
      </RouterProvider>
    </ContainerProvider>,
  );

  // В случаи рендера на сервере проставляем артефакты рендера в HTTP ответ
  render.setServerValues({
    httpStatus: () => router.getHttpStatus(),
    htmlAttributes: () => helmetCtx.helmet.htmlAttributes.toString(),
    bodyAttributes: () => helmetCtx.helmet.bodyAttributes.toString(),
    title: () => helmetCtx.helmet.title.toString(),
    head: () =>
      helmetCtx.helmet.meta.toString() +
      helmetCtx.helmet.link.toString() +
      helmetCtx.helmet.script.toString() +
      helmetCtx.helmet.noscript.toString() +
      helmetCtx.helmet.style.toString(),
  });

  return render;
}
