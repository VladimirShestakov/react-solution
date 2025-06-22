import express from 'express';
import mc, { type Patch } from 'merge-change';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import type { Express, Request, Response } from 'express';
import type { Proxy, Ssr, ViteDev } from 'react-solution/server';
import type { AppConfig } from './types.ts';

export class App {
  protected app: Express;
  protected config: AppConfig = {
    host: 'localhost',
    port: 8050,
  };

  constructor(
    protected depends: {
      env: Env;
      proxy: Proxy;
      config: Patch<AppConfig>;
      vite: ViteDev;
      ssr: Ssr;
    },
  ) {
    this.app = express();
    this.config = mc.merge(this.config, depends.config);
  }

  async start() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    // Отдача файлов кроме index.html
    if (this.depends.env.PROD) {
      this.app.use(express.static(path.resolve(__dirname, '../../dist/client'), { index: false }));
    }
    this.app.use(express.json()); // for parsing application/json
    this.app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    this.app.use(cookieParser());

    // Проксирование запросов в соответствии с настройками приложения.
    // Используется клиентским приложением для обхода CORS.
    // Если проксирование настроить в nginx, то сервис proxy нужно отключить
    if (this.depends.proxy.isEnabled()) {
      this.app.use(this.depends.proxy.requestHandler);
    }

    // Сборщик Vite клиентского приложения (в режиме разработки), чтобы SSR мог использовать src вместо dist.
    // Подключает обработчики для горячего обновления фронта.
    if (this.depends.vite.isEnabled()) {
      this.app.use(this.depends.vite.middlewares!);
    }

    // Некоторые запросы игнорируем, например запрос на несуществующую favicon.ico, чтобы предотвратить рендер
    this.app.get(/\.(ico)+$/u, (req: Request, res: Response) => {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('Not Found');
    });

    // Запросы на страницы клиентского приложения
    this.app.get('/*', (req, res) => {
      this.depends.ssr.requestHandler(req, res);
    });

    this.app.listen(this.config.port);

    console.info(`Server run on http://${this.config.host}:${this.config.port}`);
  }
}
