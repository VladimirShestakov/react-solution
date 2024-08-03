import type { Token } from '../token';
import type { ExtractTokensTypes } from '../token/types.ts';
import useContainer from './use-container.ts';

/**
 * Хук для выбора множества сервисов из DI по указанной карте токенов (Map)
 * Сервисы будут возвращены под теми же ключами, под которыми указаны токены в depends.
 *
 * @example
 * ```ts
 *  const { i18n, store } = useServicesMap({i18n: I18N_TOKEN, store: STORE_TOKEN})
 * ```
 */
export default function useServicesMap<Deps extends Record<string, Token>>(depends: Deps): ExtractTokensTypes<Deps> {
  return useContainer().getMappedWithSuspense(depends);
}
