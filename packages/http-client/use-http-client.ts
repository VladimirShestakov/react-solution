import useService from '../container/use-service.ts';
import { HTTP_CLIENT } from './token.ts';
import type { HttpClient } from './types.ts';

/**
 * Хук для доступа к HttpClient из react
 */
export default function useHttpClient(): HttpClient {
  return useService(HTTP_CLIENT);
}
