import mc, { type Patch } from 'merge-change';
import type { HttpClient } from '../types';
import type { ApiBaseEndpointConfig, ApiBaseEndpointResponse } from './types';

/**
 * Абстрактный класс для апи клиента.
 * Позволяет переопределить общие настройки для Http клиента
 */
export abstract class ApiBaseEndpoint<
  Config extends ApiBaseEndpointConfig = ApiBaseEndpointConfig,
> {
  protected config: Config = {
    url: `/api/v1/base-endpoint`, // поменять при наследовании
  } as Config;

  constructor(
    protected depends: {
      httpClient: HttpClient;
      config?: Patch<Config>;
    },
  ) {
    this.config = mc.merge(this.config, depends.config) as Config;
  }

  /**
   * Запрос
   * @return {*}
   */
  async request<T = any, R = ApiBaseEndpointResponse<T>, D = any>(
    options: ApiBaseEndpointConfig<D>,
  ): Promise<R> {
    // Учитываются опции модуля и переданные в аргументах
    return this.depends.httpClient.request(
      mc.merge(this.config, options as Patch<Config>) as Config,
    );
  }
}
