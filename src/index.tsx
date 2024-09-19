import root from '@src/root';

/**
 * Запуск рендера в браузере.
 */
(async function () {
  const dom = document.getElementById('root');
  if (!dom) throw new Error(`Failed to find the DOM element by "root"`);

  const render = await root();

  render.start(dom);
})();
