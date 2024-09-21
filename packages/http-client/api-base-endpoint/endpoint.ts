import mc from 'merge-change';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { HttpClient } from '../types.ts';
import type { ApiBaseEndpointOptions } from './types';

/**
 * Абстрактный класс для апи клиента.
 * Позволяет переопределить общие настройки для Http клиента
 */
export abstract class ApiBaseEndpoint<Config extends AxiosRequestConfig = AxiosRequestConfig> {
  protected config: ApiBaseEndpointOptions;

  constructor(
    protected depends: {
      httpClient: HttpClient;
      config?: Patch<Config>;
    },
  ) {
    this.config = mc.merge(this.defaultConfig(), depends.config ?? {});
  }

  /**
   * Конфигурация по умолчанию.
   * Переопределяется общими параметрами сервиса api и параметрами из конфига экземпляра
   */
  protected defaultConfig(): Config {
    return {
      url: `/api/v1/base-endpoint`, // поменять при наследовании
    } as Config;
  }

  /**
   * Запрос
   * @return {*}
   */
  async request<T = any, R = AxiosResponse<T>, D = any>(
    options: AxiosRequestConfig<D>,
  ): Promise<R> {
    // Учитываются опции модуля и переданные в аргументах
    return this.depends.httpClient.request(mc.merge(this.config, options as Patch<Config>));
  }
}
