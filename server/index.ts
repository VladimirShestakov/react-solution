/**
 * HTTP server for render
 */
import { Container } from '../packages/container';
import { envServer } from '../packages/env/server.ts';
import { cacheStore } from '../packages/cache-store';
import { ssr } from '../packages/ssr';
import { proxy } from '../packages/proxy';
import { viteDev } from '../packages/vite-dev';
import { app } from './app/inject.ts';
import { APP } from './app/token.ts';
import configs from './config.ts';

try {
  // Подключение используемых сервисов в контейнер управления зависимостями
  const services = new Container()
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

  const appInstance = await services.get(APP);
  await appInstance.start();
} catch (e) {
  console.error(e);
}
