import { useContext } from 'react';
import { ContainerContext } from './provider.tsx';
import type { Container } from './types';

/**
 * Хук для доступа к DI контейнеру.
 * Для использования React приложение должно быть обернуто в <ContainerProvider>
 */
export default function useContainer(): Container {
  return useContext(ContainerContext);
}
