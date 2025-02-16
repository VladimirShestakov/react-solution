import React from 'react';
import { type Solutions } from './solutions.ts';

/**
 * Контекст для DI контейнера React-Solution.
 */
export const SolutionsContext = React.createContext<Solutions>({} as Solutions);

/**
 * React провайдер DI контейнера React-Solution.
 * Подключает контекст к приложению для доступа к контейнеру решений.
 */
export function SolutionsProvider({
  solutions,
  children,
}: {
  solutions: Solutions;
  children: React.ReactNode;
}) {
  return <SolutionsContext.Provider value={solutions}>{children}</SolutionsContext.Provider>;
}
