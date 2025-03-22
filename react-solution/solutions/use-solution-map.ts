import { useContext } from 'react';
import { type Tokens, type TypesFromTokens } from '../token';
import { SolutionsContext } from './provider.tsx';

/**
 * Хук для выбора множества программных решений за раз из DI контейнера по указанной карте токенов (Map)
 * Программные решения будут возвращены под теми же ключами, под которыми указаны токены в depends.
 * В приложении должен использоваться компонент `<Suspense>`, так как хук выкидывает исключения на ожидание решений.
 * @throws
 * @example
 * ```ts
 *  const { i18n, store } = useSolutionMap({i18n: I18N_TOKEN, store: STORE_TOKEN})
 * ```
 */
export function useSolutionMap<DepsType extends Tokens>(
  depends: DepsType,
): TypesFromTokens<DepsType> {
  return useContext(SolutionsContext).getMappedWithSuspense(depends);
}
