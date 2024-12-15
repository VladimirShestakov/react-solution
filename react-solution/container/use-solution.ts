import { useContext } from 'react';
import type { Token } from '../token';
import { SolutionsContext } from './provider.tsx';

/**
 * Хук для выборки сервиса из DI контейнера по токену.
 * В приложении должен использовать компонент <Suspense> так как хук выкидывает исключения на ожидания.
 * Если сервис не выбран, то компонент прекратит свою работу.
 * @throws
 * @example
 * ```ts
 *  const i18n = useSolution(I18N_TOKEN)
 * ```
 *
 */
export function useSolution<Type>(token: Token<Type>): Type {
  return useContext(SolutionsContext).getWithSuspense(token);
}
