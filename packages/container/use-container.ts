import { useContext } from 'react';
import { ContainerContext } from './provider';
import { type Container } from './container';

/**
 * Хук для доступа к DI контейнеру.
 * Для использования React приложение должно быть обернуто в <ContainerProvider>
 */
export function useContainer(): Container {
  return useContext(ContainerContext);
}
