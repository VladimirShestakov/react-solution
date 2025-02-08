import type { EventsMap, Listener } from './types';

/**
 * Эмиттер событий.
 * Для строгой типизации событий нужно указать mapped тип, где ключ - название события, значение - тип для параметров события.
 *
 * Например
 * ```ts
 * type SomeEventsMap = {
 *   onFirst: {
 *     param1: number,
 *     param2: string
 *   },
 *   osLast: {
 *     param1: number,
 *   }
 * }
 *
 * const events = new Events<SomeEventsMap>();
 *
 * events.emit('onFirst', { param1: 100, param2: 'value' })
 *
 * ```
 * @todo Реализовать защиту для отправку события и очистки всех событий, например нужно указать ключ, который указывается в конструкторе
 */
export class Events<E extends EventsMap = EventsMap> {
  protected listeners: Map<keyof E & string, Map<Listener, boolean>> = new Map();

  /**
   * Подписка на событие.
   * Возвращается функция для отписки
   * @param event Название события
   * @param listener Функция, которая будет вызвана при возникновении события
   * @param once
   */
  on<N extends keyof E & string, P = E[N]>(
    event: N,
    listener: Listener<P>,
    once = false,
  ): () => void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.set(listener, once);
    } else {
      this.listeners.set(event, new Map([[listener, once]]));
    }

    return () => this.off(event, listener);
  }

  /**
   * Одноразовая подписка на событие.
   * Возвращается функция для отписки
   * @param event Название события
   * @param listener Функция, которая будет вызвана при возникновении события
   */
  once<N extends keyof E & string, P = E[N]>(event: N, listener: Listener<P>): () => void {
    return () => this.on(event, listener, true);
  }

  /**
   * Отписка функции от события
   * @param event Название события
   * @param listener Функция, которая была зарегистрирована при подписке на события методом on или once
   */
  off<N extends keyof E & string, P = E[N]>(event: N, listener: Listener<P>): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(listener);
    }
  }

  /**
   * Отписка всех функций от события
   * @param event Название события
   */
  offEvent<N extends keyof E & string>(event: N): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.clear();
    }
  }

  /**
   * Отписка всех функций от всех событий
   */
  clear(): void {
    this.listeners.clear();
  }

  /**
   * Вызов события, который приводит к выполнению зарегистрированных функций-обработчиков события
   * @param event Название события
   * @param params Параметры события, которые будут переданы в функции-обработчики события
   */
  async emit<N extends keyof E & string, P = E[N]>(event: N, params?: P): Promise<void> {
    if (this.listeners.has(event)) {
      const promises = [];
      for (const [listener, once] of this.listeners.get(event)!) {
        if (once) this.off(event, listener);
        promises.push(listener(params));
      }
      await Promise.all(promises);
    }
  }
}
