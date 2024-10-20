import React from 'react';
import { RENDER_SERVICE, type SolutionsFactory } from '../../render';

export type RenderParams = {
  key: string;
  env: Env;
  url: string;
  headers: Record<string, string | undefined | string[]>;
  cookies: Record<string, string>;
  template: string;
  maxAge: number;
};

export type RenderResult = {
  html: string;
  // http статус
  status: number;
  // Для редиректа
  location?: string;
  // Параметры рендера
  params: RenderParams;
};

export type RenderError = {
  params: RenderParams;
  error: Error;
};

export async function render(clientApp: SolutionsFactory, params: RenderParams): Promise<RenderResult> {
  // Fix for react render;
  React.useLayoutEffect = React.useEffect;

  // Получаем React приложение для рендера
  // Параметры запроса передаются как переменные окружения
  const clientSolutions = await clientApp({
    ...params.env,
    REQUEST: {
      url: params.url,
      headers: params.headers,
      cookies: params.cookies,
    },
  });

  const renderService = await clientSolutions.get(RENDER_SERVICE);
  const renderResult = await renderService.ssr(params.template);

  return { ...renderResult, params };
}
