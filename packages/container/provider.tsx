import React from 'react';
import { type Container } from './container';

/**
 * Контекст для DI контейнера
 */
export const ContainerContext = React.createContext<Container>({} as Container);

/**
 * React провайдер для DI контейнера
 * Подключает контекст к приложению для доступа к сервисам.
 * Провайдер не обрабатывает изменения в services.
 */
export function ContainerProvider({
  container,
  children,
}: {
  container: Container;
  children: React.ReactNode;
}) {
  return <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>;
}
