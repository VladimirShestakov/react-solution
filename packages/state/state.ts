import mc from 'merge-change';
import { css, type LogInterface } from '../log';
import type { Patch } from '../types';

/**
 * Состояние по паттерну наблюдателя (Observable)
 */
export class State<StateType> {
  protected data: StateType;
  protected readonly listeners: Set<() => void> = new Set();

  constructor(
    protected initState: StateType,
    protected logger?: LogInterface,
  ) {
    this.data = initState;
  }

  get = (): StateType => {
    return this.data;
  };

  /**
   * Установка state.
   * Необходимо учитывать иммутабельность.
   * @param newState Новое состояния всех модулей
   * @param [description] Описание действия для логирования
   */
  set = (newState: StateType, description = 'Установка') => {
    if (this.logger) {
      this.logger.group(
        `%c${this.logger.getName() || this.constructor.name} %c${description}`,
        css({ color: '#777', 'font-weight': 'normal' }),
        css({ color: '#333', 'font-weight': 'bold' }),
      );
      this.logger.log(`%c${'prev:'}`, css({ color: '#d77332' }), this.data);
      this.logger.log(`%c${'next:'}`, css({ color: '#2fa827' }), newState);
      this.logger.groupEnd();
    }
    this.data = newState;
    this.notify();
  };

  /**
   * Обновление состояния
   * @param update Изменяемые свойства. Может содержать операторы $set, $unset и др из https://www.npmjs.com/package/merge-change
   * @param [description] Описание действия для логирования
   */
  update = (update: Partial<StateType> | Patch<StateType>, description = 'Обновление') => {
    const state = mc.update(this.get(), update);
    if (state !== this.get()) {
      this.set(state, description);
    }
  };

  /**
   * Сброс состояния в начальное с возможностью подмешать изменения
   * @param update Изменяемые свойства у начального состояния. Может содержать операторы $set, $unset и др из https://www.npmjs.com/package/merge-change
   * @param description Описание действия для логирования
   */
  reset = (update: Partial<StateType> | Patch<StateType>, description = 'Сброс') => {
    this.set(mc.update(this.initState, update), description);
  };

  /**
   * Подписка на изменение state.
   * Возвращается функция для отписки
   * @param listener Функция, которая будет вызываться после установки состояния
   */
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /**
   * Вызываем всех слушателей
   */
  protected notify = () => {
    this.listeners.forEach(listener => listener());
  };
}
