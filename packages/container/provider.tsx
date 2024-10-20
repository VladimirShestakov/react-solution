import React from 'react';
import { type Container } from './container';

/**
 * Контекст для DI контейнера React-Solution.
 */
export const SolutionsContext = React.createContext<Container>({} as Container);

/**
 * React провайдер DI контейнера React-Solution.
 * Подключает контекст к приложению для доступа к контейнеру решений.
 */
export function SolutionsProvider({
  solutions,
  children,
}: {
  solutions: Container;
  children: React.ReactNode;
}) {
  return <SolutionsContext.Provider value={solutions}>{children}</SolutionsContext.Provider>;
}
