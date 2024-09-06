import type { Token } from '@packages/token';
import useContainer from './use-container.ts';

/**
 * Хук для выборки сервиса из DI контейнера по токену.
 * В React приложении должен использоваться <Suspense>
 * так как при ожидании выборки сервиса выбрасывается исключения с promise
 *
 * @example
 * ```ts
 *  const i18n = useService(I18N_TOKEN)
 * ```
 */
export default function useService<Type>(token: Token<Type>): Type {
  return useContainer().getWithSuspense(token);
}
