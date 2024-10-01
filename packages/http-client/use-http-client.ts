import { useService } from '../container';
import { HTTP_CLIENT } from './token';
import type { HttpClient } from './types';

/**
 * Хук для доступа к HttpClient из react
 */
export default function useHttpClient(): HttpClient {
  return useService(HTTP_CLIENT);
}
