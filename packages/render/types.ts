import type { TWaitDump } from '../waiting-store';

export type RenderConfig = {
  // Идентификатор DOM элемента, куда рендерить
  domId: string;
  // Таймаут на случай зацикливания при рендере на сервере.
  // Должен быть больше чем любые таймауты в приложении, например больше таймаутов на HTTP запросы.
  renderTimeout: number;
};

export type RenderDump = {
  waiting: TWaitDump;
};

export type SsrResult = {
  html: string;
  status: number;
  location?: string;
}

export * from './meta/types'
