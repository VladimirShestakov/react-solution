import { dumpService } from './dump';
import { envClient } from './env';
import { httpClient } from './http-client';
import { i18nService } from './i18n';
import { logService } from './log';
import { modalsService } from './modals';
import { renderService } from './render';
import { routerService } from './router';
import type { Patch } from 'merge-change';

export const commonSolutions = (envPatch: Patch<Env> = {}) => [
  // Переменные окружения для фронта
  envClient(envPatch),
  routerService,
  dumpService,
  renderService,
  httpClient,
  modalsService,
  i18nService,
  logService,
];
