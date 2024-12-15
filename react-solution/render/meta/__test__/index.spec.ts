import { replaceInner } from '../../../utils';
import { Meta } from '../index';

describe('meta-dom', () => {
  test('parse html', () => {
    const service = new Meta();

    const template = `
      <!doctype html>
      <html  lang="ru">
        <head>
          <script type="module">window.initialData='{}';</script>
          <script type="module">
            import { inject } from '/@vite-plugin-checker-runtime';
            inject({
              overlayConfig: {},
              base: '/',
            });
          </script>

          <script type="module">
            import RefreshRuntime from '/@react-refresh';
            RefreshRuntime.injectIntoGlobalHook(window);
            window.$RefreshReg$ = () => {};
            window.$RefreshSig$ = () => (type) => type;
            window.__vite_plugin_react_preamble_installed__ = true;
          </script>

          <script type="module" src="/@vite/client"></script>

          <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
          <title>App</title>
          <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
          <base href="/" />
          <script type="module" src="index.tsx"></script>
        </head>
        <body  data-attr="1" class="test example" id="9999">
          <div id="root"><!--$--></div>
        </body>
      </html>
    `;

    service.initFromHtml(template);

    const result = [];
    for (const key of service.getKeys()) {
      const element = service.get(key)!;
      if (element.type === 'html' || element.type === 'head' || element.type === 'body') {
        result.push(element.getStringParts()!.open);
      } else {
        result.push(element.getStringParts()!.full);
      }
    }

    expect(result).toEqual([
      '<html lang="ru">',
      '<body data-attr="1" class="test example" id="9999" class="test example">',
      '<head>',
      `<script type="module">window.initialData='{}';</script>`,
      '<script type="module">\n' +
        "            import { inject } from '/@vite-plugin-checker-runtime';\n" +
        '            inject({\n' +
        '              overlayConfig: {},\n' +
        "              base: '/',\n" +
        '            });\n' +
        '          </script>',
      '<script type="module">\n' +
        "            import RefreshRuntime from '/@react-refresh';\n" +
        '            RefreshRuntime.injectIntoGlobalHook(window);\n' +
        '            window.$RefreshReg$ = () => {};\n' +
        '            window.$RefreshSig$ = () => (type) => type;\n' +
        '            window.__vite_plugin_react_preamble_installed__ = true;\n' +
        '          </script>',
      '<script type="module" src="/@vite/client"></script>',
      '<meta http-equiv="Content-type" content="text/html; charset=utf-8" />',
      '<title>App</title>',
      '<link rel="icon" type="image/x-icon" href="/images/favicon.ico" />',
      '<base href="/" />',
      '<script type="module" src="index.tsx"></script>',
    ]);
  });
});
