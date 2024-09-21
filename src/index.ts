import clientApp from '@src/client-app.tsx';

/**
 * Запуск рендера в браузере.
 */
clientApp().then(render => {
  render.start();
});
