import mc from 'merge-change';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { HttpClientOptions } from './types';
import type { Patch } from '../types';

export class HttpClient {
  protected axios: AxiosInstance;
  protected config: HttpClientOptions = {
    baseURL: '',
  };

  constructor(
    protected depends: {
      config?: Patch<HttpClientOptions>;
    },
  ) {
    this.config = mc.merge(this.config, depends.config ?? {});
    this.axios = axios.create(this.config);
  }

  /**
   * Установка общего заголовка для всех endpoints
   * @param name Название заголовка
   * @param value Значение заголовка
   */
  setHeader(name: string, value?: string | null) {
    if (value) {
      this.axios.defaults.headers[name] = value;
    } else if (name in this.axios.defaults.headers) {
      delete this.axios.defaults.headers[name];
    }
  }

  /**
   * Запрос
   */
  async request<T = any, R = AxiosResponse<T>, D = any>(
    options: AxiosRequestConfig<D>,
  ): Promise<R> {
    // Учитываются опции модуля и переданные в аргументах
    return this.axios.request(options);
  }
}
