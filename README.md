# React Solution

Решение для разработки web приложений на React & Vite с рендером на сервере (SSR) или клиенте (SPA).

## Новый проект

```
npm create react-solution@latest
```

## Требования

- Node.js >= 18

## Документация

http://react-solution.pro/

## Развертывание и запуск

Для проверки собранного приложения на локальном компьютере выполните команду:

`npm run preview` - запустится локальный сервер для отдачи статических файлов из /dist/client.
При этом выполнится сборка браузерной версии приложения.

или

`npm run preview:server` - запустится сервер для рендера приложения и отдачи статических файлов.
При этом выполнится сборка браузерной и серверной версии приложения.

Если приложение уже собрано, то сервер рендера можно запустить командой `ts-node ./server/index.ts`.

Для постоянной работы сервера рендера можно воспользоваться менеджером процессов pm2.

`pm2 start process.json`

На внешний сервер необходимо перенести папки с файлами:

```
- /dist
- /node_modules
- /server
- /typings
- tsconfig.json
- package.json
- proxy.config.ts
```

Если сервер рендера (SSR) не нужен, то переносится только `/dist/client`

### Nginx

Рекомендуется использовать nginx.

В режиме **без** рендера Nginx должен отдавать только файлы из папки `./dist/client`.
Если запрос не на файл, то нужно отдавать `./dist/client/index.html`.

Пример настройки nginx

```
server {
  listen 80;
  server_name react-solution.com;
  location / {
    root /home/user/react-solution/dist/client;
    try_files $uri /index.html;
  }
}
```

В режиме рендера (SSR) запускается приложение на node.js `ts-node ./server/index.ts`.
Через nginx все запросы на страницы сайта проксируются на сервер рендера.

Можно проксировать вообще все запросы, так как сервер рендера сам выполнит либо рендер, либо
отдаст файлы из ./dist/client/assets/, а также спроксирует запросы к АПИ.

Для оптимизации отдачу файлов и проксирование к АПИ лучше выполнять через nginx.

```
server {
  listen 80;
  server_name react-solution.com;
  client_max_body_size 10M;

  # Прокси к АПИ (в соотв. с настройками приложения)
  location /api/ {
    proxy_redirect off;
    proxy_set_header Host api.react-solution.com;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Frame-Options SAMEORIGIN;
    proxy_pass https://api.react-solution.com;
  }

  # Запросы к файлам сборки (скрипты, стили, картинки..)
  location /assets/ {
    root /home/user/react-solution/dist/client;
    try_files $uri $uri/ =404;
  }

  # Рендер - проксирование запроса в серверное приложение на 127.0.0.1:8050
  location / {
    proxy_redirect off;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Frame-Options SAMEORIGIN;
    proxy_pass http://127.0.0.1:8050;
  }
}
```
