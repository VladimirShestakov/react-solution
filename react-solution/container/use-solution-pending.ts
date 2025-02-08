import type { Token } from '../token';
import { WaitStatus } from '../waiting-store';
import { useContext, useEffect, useState } from 'react';
import { SolutionsContext } from './provider.tsx';

/**
 * Хук для выборки сервиса из DI контейнера по токену с признаками ожидания/успеха/ошибки.
 * Для хука не нужен Suspense, хук не выкидывает исключения.
 *
 * Если сервис ещё не готов (асинхронно создаётся), то не будет возвращен,
 * но будут возвращен признак isWaiting = true.
 * При готовности сервиса (или ошибки его подготовки) хук заставит компонент перерендериться и
 * при следующем выполнении вернет сервис с признаком isSuccess = true.
 * Если будет ошибка подготовки сервиса, то он не вернется, но будет признак isError = true
 * @example
 * ```ts
 *  const i18n = useSolutionPending(I18N_TOKEN)
 *  console.log(i18n.service)
 *  console.log(i18n.isSuccess)
 *  console.log(i18n.isWaiting)
 *  console.log(i18n.isError)
 *
 *  if (i18n.service) {
 *     // Действия если сервис получен
 *  }
 *
 * ```
 */
export function useSolutionPending<Type>(token: Token<Type>): {
  instance: Type | undefined;
  isSuccess: boolean;
  isWaiting: boolean;
  isError: boolean;
} {
  const container = useContext(SolutionsContext);
  let instance: Type | undefined = undefined;
  // Попытка получить сервис синхронно
  try {
    instance = container.getWithSuspense(token);
  } catch {
    // Значит сервис ещё не создан, при этом контейнер создаст обещание на промис
  }

  const [status, setStatus] = useState(container.getStatus(token));

  useEffect(() => {
    // Ждём выполнения обещания на сервис, если сервис ещё не получен
    if (!instance)
      container
        .get(token)
        .then(() => setStatus(container.getStatus(token)))
        .catch(() => setStatus(container.getStatus(token)));
  }, []);

  return {
    instance,
    isSuccess: status === WaitStatus.Success,
    isWaiting: status === WaitStatus.Waiting,
    isError: status === WaitStatus.Error,
  };
}
