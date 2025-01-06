import type { ReactNode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { BufferedStream } from './buffered-stream';

export async function asyncRender(reactNode: ReactNode, timeout: number = 6000) {
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
      abort();
    }, timeout);

    stream.on('finish', () => {
      if (renderTimeout) clearTimeout(renderTimeout);
      if (renderError) {
        reject(renderError);
      } else {
        resolve(stream.buffer);
      }
    });
  });
}
