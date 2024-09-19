import { newToken } from '../../packages/token';
// import type { ContainerType } from './types.ts';

/**
 * Токен на контейнер DI.
 * Используется в DI, чтобы сервис мог получить в зависимость весь контейнер DI
 */
export const CONTAINER = newToken<any>('@react-skeleton/container');
