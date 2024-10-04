import type { Token } from '../token';
import { WaitStatus } from '../waiting-store';
import { useEffect, useState } from 'react';
import { useContainer } from './use-container';

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
 *  const i18n = useServicePending(I18N_TOKEN)
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
export function useServicePending<Type>(token: Token<Type>): {
  service: Type | undefined;
  isSuccess: boolean;
  isWaiting: boolean;
  isError: boolean;
} {
  const container = useContainer();
  let service: Type | undefined = undefined;
  // Попытка получить сервис синхронно
  try {
    service = container.getWithSuspense(token);
  } catch {
    // Значит сервис ещё не создан, при этом контейнер создаст обещание на промис
  }

  const [status, setStatus] = useState(container.getStatus(token));

  useEffect(() => {
    // Ждём выполнения обещания на сервис, если сервис ещё не получен
    if (!service)
      container
        .get(token)
        .then(() => setStatus(container.getStatus(token)))
        .catch(() => setStatus(container.getStatus(token)));
  }, []);

  return {
    service,
    isSuccess: status === WaitStatus.Success,
    isWaiting: status === WaitStatus.Waiting,
    isError: status === WaitStatus.Error,
  };
}
