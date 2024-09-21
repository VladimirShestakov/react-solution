import {
  AxiosError as ApiError,
  type AxiosRequestConfig as HttpClientOptions,
  type AxiosResponse as ApiResponse,
} from 'axios';

export { ApiError, HttpClientOptions, ApiResponse };

export type { HttpClient } from './service';
