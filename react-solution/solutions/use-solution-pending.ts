import type { Token } from '../token';
import { WaitStatus } from '../waiting-store';
import { useContext, useEffect, useState } from 'react';
import { SolutionsContext } from './provider.tsx';

/**
 * Хук для выборки программного решения из DI контейнера по токену с признаками ожидания/успеха/ошибки.
 * Для хука не нужен `<Suspense>`, хук не выкидывает исключения.
 *
 * Если программное решение ещё не готово (асинхронно создаётся), то не будет возвращено,
 * но будут возвращен признак `isWaiting = true`.
 * При готовности программного решения (или при ошибки его создания) хук заставит компонент перерендериться и
 * при следующем выполнении хук вернет программное решение `instance` и признак `isSuccess = true`.
 * Если будет ошибка подготовки программного решения, то оно не вернется, но будет получен признак `isError = true`
 * @example
 * ```ts
 *  const i18n = useSolutionPending(I18N_TOKEN)
 *  console.log(i18n.instance)
 *  console.log(i18n.isSuccess)
 *  console.log(i18n.isWaiting)
 *  console.log(i18n.isError)
 *
 *  if (i18n.instance) {
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
  const solutions = useContext(SolutionsContext);
  let instance: Type | undefined = undefined;
  // Попытка получить сервис синхронно
  try {
    instance = solutions.getWithSuspense(token);
  } catch {
    // Значит сервис ещё не создан, при этом контейнер создаст обещание на промис
  }

  const [status, setStatus] = useState(solutions.getStatus(token));

  useEffect(() => {
    // Ждём выполнения обещания на сервис, если сервис ещё не получен
    if (!instance)
      solutions
        .get(token)
        .then(() => setStatus(solutions.getStatus(token)))
        .catch(() => setStatus(solutions.getStatus(token)));
  }, []);

  return {
    instance,
    isSuccess: status === WaitStatus.Success,
    isWaiting: status === WaitStatus.Waiting,
    isError: status === WaitStatus.Error,
  };
}
