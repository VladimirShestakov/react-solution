import { I18N_CFG } from 'react-solution';
import { config } from 'react-solution';
import { HTTP_CLIENT_CFG } from 'react-solution';
import { SESSION_STORE_CFG } from '@src/features/auth/session-store/token.ts';

export const configs = [
  config(HTTP_CLIENT_CFG, ({ env }) => ({
    // Обычно хост на апи относительный и используется прокси для устранения CORS
    // Но в режиме рендера на сервере необходимо указать полный адрес к АПИ
    baseURL: env.SSR ? env.API_URL : '',
    //headers: {},
    //auth:{} base auth
  })),

  config(I18N_CFG, {
    log: false,
    locale: 'ru-RU', // локаль по умолчанию если не будет определена автоматически
    auto: true,
    remember: true,
  }),

  config(SESSION_STORE_CFG, {
    log: false,
    tokenHeader: 'X-Token',
  }),
];