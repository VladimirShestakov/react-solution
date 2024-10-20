import { useContext } from 'react';
import { type Token, type TypesFromTokens } from '../token';
import { SolutionsContext } from './provider.tsx';

/**
 * Хук для выбора множества сервисов из DI по указанной карте токенов (Map)
 * Сервисы будут возвращены под теми же ключами, под которыми указаны токены в depends.
 * В приложении должен использовать компонент <Suspense> так как хук выкидывает исключения на ожидания.
 * @throws
 * @example
 * ```ts
 *  const { i18n, store } = useSolutionMap({i18n: I18N_TOKEN, store: STORE_TOKEN})
 * ```
 */
export function useSolutionMap<Deps extends Record<string, Token>>(
  depends: Deps,
): TypesFromTokens<Deps> {
  return useContext(SolutionsContext).getMappedWithSuspense(depends);
}
