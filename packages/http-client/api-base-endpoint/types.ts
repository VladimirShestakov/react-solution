import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export type ApiBaseEndpointConfig<D = any> = AxiosRequestConfig<D>;

export type ApiBaseEndpointResponse<T = any, D = any> = AxiosResponse<T, D>;
