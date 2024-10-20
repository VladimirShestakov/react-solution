/**
 * HTTP server for render
 */
import { Container } from 'react-solution';
import { envServer } from 'react-solution/server';
import { cacheStore } from 'react-solution/server';
import { ssr } from 'react-solution/server';
import { proxy } from 'react-solution/server';
import { viteDev } from 'react-solution/server';

import { app } from './app/inject.ts';
import { APP } from './app/token.ts';
import configs from './config.ts';

try {
  // Подключение используемых сервисов в контейнер управления зависимостями
  const solutions = new Container()
    // Переменные окружения для сервера
    .set(envServer())
    // Настройки для всех сервисов
    .set(configs)
    // Сервис проксирования к АПИ (для локальной отладки prod сборки)
    .set(proxy)
    // Сервис кэширования SSR
    .set(cacheStore)
    // Сборщик Vite для запуска SSR в dev режиме (без сборки)
    .set(viteDev)
    // Сервис рендера (SSR)
    .set(ssr)
    // Приложение, определяющее основной ход работ
    .set(app);

  const appInstance = await solutions.get(APP);
  await appInstance.start();
} catch (e) {
  console.error(e);
}
