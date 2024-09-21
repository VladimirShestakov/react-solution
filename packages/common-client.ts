import { dumpService } from './dump';
import { httpClient } from './http-client';
import { i18nService } from './i18n';
import { modalsService } from './modals';
import { renderService } from './render';
import { routerService } from './router';

export const commonClient = [
  routerService,
  dumpService,
  renderService,
  httpClient,
  modalsService,
  i18nService,
];
