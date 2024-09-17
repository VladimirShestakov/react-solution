import type { Token } from '@packages/token';
import { useContainer } from './use-container.ts';

/**
 * Хук для выборки сервиса из DI контейнера по токену.
 * В приложении должен использовать компонент <Suspense> так как хук выкидывает исключения на ожидания.
 * Если сервис не выбран, то компонент прекратит свою работу.
 * @throws
 * @example
 * ```ts
 *  const i18n = useService(I18N_TOKEN)
 * ```
 *
 */
export function useService<Type>(token: Token<Type>): Type {
  return useContainer().getWithSuspense(token);
}
