import { type Token, type TypesFromTokens } from '../../packages/token';
import { useContainer } from './use-container.ts';

/**
 * Хук для выбора множества сервисов из DI по указанной карте токенов (Map)
 * Сервисы будут возвращены под теми же ключами, под которыми указаны токены в depends.
 * В приложении должен использовать компонент <Suspense> так как хук выкидывает исключения на ожидания.
 * @throws
 * @example
 * ```ts
 *  const { i18n, store } = useServicesMap({i18n: I18N_TOKEN, store: STORE_TOKEN})
 * ```
 */
export function useServicesMap<Deps extends Record<string, Token>>(depends: Deps): TypesFromTokens<Deps> {
  return useContainer().getMappedWithSuspense(depends);
}
