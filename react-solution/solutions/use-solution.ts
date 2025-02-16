import { useContext } from 'react';
import type { Token } from '../token';
import { SolutionsContext } from './provider.tsx';

/**
 * Хук для выборки программного решения из DI контейнера по токену.
 * В приложении должен использоваться компонент `<Suspense>`, так как хук выкидывает исключения на ожидания решения.
 * Если программное решение не удастся выбрать, то компонент прекратит свою работу.
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
