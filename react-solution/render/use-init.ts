import { useSolutionMap } from '../solutions';
import { ENV } from '../env';
import { RENDER_SERVICE } from '../render';
import { useEffect } from 'react';

/**
 * Хук для асинхронной инициализации
 * По умолчанию исполняется при первом рендере или изменении зависимостей deps.
 * На сервере используется логика Suspense для ожидания fn, это значит fn будет вызвана сразу и выбросит исключение,
 * если окажется асинхронной.
 * На клиенте fn выполнится в хуке useEffect, т.е. после рендера. На клиенте не используется suspense,
 * так как не решен полностью вопрос идентификации промисов.
 * (Для ssr хук ожидает строковый код действия, по которому идентифицируется промис)
 * @param fn Асинхронная пользовательская функция
 * @param deps Значения, при смене которых fn снова исполнится (если исполнялась на сервере, то нужен флаг option.force)
 * @param options Опции выполнения fn
 */
export function useInit(
  fn: () => Promise<unknown> | unknown,
  deps: unknown[] = [],
  options: UseInitOptions = {},
) {
  const { env, render } = useSolutionMap({ env: ENV, render: RENDER_SERVICE });

  // Suspense используется только на сервере для ожидания инициализации перед итоговым рендером
  if (env.SSR && options.ssr) {
    if (render.waiting.isMissing(options.ssr)) render.waiting.add(options.ssr, fn());
    if (render.waiting.isWaiting(options.ssr)) throw render.waiting.getPromise(options.ssr);
    if (render.waiting.isError(options.ssr)) throw render.waiting.getError(options.ssr);
  }

  // Хук работает только в браузере.
  useEffect(() => {
    // Функция выполняется, если не было ожиданий (хук ещё не выполнялся) или требуется перезагрузка
    if (!options.ssr || !render.waiting.has(options.ssr) || options.force) {
      fn();
    } else {
      // Удаляем инициализацию от ssr, чтобы при последующих рендерах fn() работала
      if (options.ssr) render.waiting.delete(options.ssr);
    }
  }, deps);
}

export type UseInitOptions = {
  /**
   * Ключ для выполнения fn на сервере. Если не указан, то fn не выполняется при SSR.
   * Можно указать строку, например "Load articles".
   * По ключу на клиенте определяется, выполнялась ли инициализация на сервере.
   * По указанному ключу запоминается промис от fn(), чтобы его повторно не создавать при очередном рендере, а проверить его статус.
   */
  ssr?: string;
  /**
   * Перевыполнить fn на клиенте, если была выполнена инициализация на сервере.
   */
  force?: boolean;
  /**
   * Выполнять fn при переходе по истории навигации.
   * Используется, если нужно отреагировать на переход назад/вперед в браузере, а не на смену/установку параметров адреса.
   * Например, когда search-парметры адреса установлены напрямую
   */
  onBackForward?: boolean;
};
