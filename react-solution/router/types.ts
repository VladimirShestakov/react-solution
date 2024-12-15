import { BrowserHistoryOptions, MemoryHistoryOptions } from 'history';
import { NavigateProps } from 'react-router-dom';

/**
 * Настройки навигации
 */
export type RouterConfig = {
  type?: string;
  basename?: string;
} & MemoryHistoryOptions &
  BrowserHistoryOptions;

export type NavigateSSRProps = NavigateProps & {
  httpStatus?: number;
};

export type HTTPStatus = {
  status: number;
  location?: string;
};

declare global {
  interface Env {
    // Базовый URL приложения, обычно "/"
    BASE_URL: string;
    // Информация о запросе при SSR (проставит сервер при получении клиентского приложения)
    REQUEST?: {
      url: string;
      headers: Record<string, string | undefined | string[]>;
      cookies: Record<string, string>;
    };
  }
}
