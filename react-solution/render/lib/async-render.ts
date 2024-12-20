import type { ReactNode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { LogInterface } from '../../log';

export async function asyncRender(
  reactNode: ReactNode,
  logger: LogInterface,
  timeout: number = 6000,
) {
  if (process.env.SSR) {
    const { BufferedStream } = await import('./buffered-stream.ts');

    return new Promise<string>((resolve, reject) => {
      let renderError: Error;
      const stream = new BufferedStream();

      // Редлер в поток, но ждём окончания рендера
      const { pipe, abort } = renderToPipeableStream(reactNode, {
        onAllReady: () => {
          pipe(stream);
        },
        onError: error => {
          renderError = error as Error;
        },
      });

      // Таймаут на случай долгого ожидания рендера
      const renderTimeout: NodeJS.Timeout = setTimeout(() => {
        logger.log('- render timeout');
        abort();
      }, timeout);

      stream.on('finish', () => {
        if (renderTimeout) clearTimeout(renderTimeout);
        if (renderError) {
          logger.log('- render errors', renderError);
          reject(renderError);
        } else {
          resolve(stream.buffer);
        }
      });
    });
  } else {
    throw new Error('asyncRender can only work on the server');
  }
}
