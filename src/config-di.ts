import { config } from '../packages/configs/utils.ts';
import { HTTP_CLIENT_CFG } from '../packages/http-client/token.ts';

export default [
  config(HTTP_CLIENT_CFG, ({ env }) => ({
    // Обычно хост на апи относительный и используется прокси для устранения CORS
    // Но в режиме рендера на сервере необходимо указать полный адрес к АПИ
    baseURL: env.SSR ? env.API_URL : '',
    //headers: {},
    //auth:{} base auth
  }))
];
