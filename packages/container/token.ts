import { newToken } from '../token';
// import type { ContainerType } from './types';

/**
 * Токен на контейнер DI.
 * Используется в DI, чтобы сервис мог получить в зависимость весь контейнер DI
 */
export const CONTAINER = newToken<any>('@react-solution/container');
