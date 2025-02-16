/**
 * HTTP server for render
 */
import { Solutions, logService } from 'react-solution';
import { envServer, cacheStore, ssr, proxy, viteDev } from 'react-solution/server';
import { app } from './app/provider.ts';
import { APP } from './app/token.ts';
import configs from './config.ts';

try {
  // Создание DI контейнера программных решений
  const solutions = new Solutions()
    // Переменные окружения для сервера
    .register(envServer())
    // Настройки для всех сервисов
    .register(configs)
    // Сервис логирования
    .register(logService)
    // Сервис проксирования к АПИ (для локальной отладки prod сборки)
    .register(proxy)
    // Сервис кэширования SSR
    .register(cacheStore)
    // Сборщик Vite для запуска SSR в dev режиме (без сборки)
    .register(viteDev)
    // Сервис рендера (SSR)
    .register(ssr)
    // Приложение, определяющее основной ход работ
    .register(app);

  const appInstance = await solutions.get(APP);
  await appInstance.start();
} catch (e) {
  console.error(e);
}
