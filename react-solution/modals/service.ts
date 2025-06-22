import type { ComponentProps } from 'react';
import type { Token } from '../token';
import { codeGenerator } from '../utils';
import { ModalsStack, ModalState, ModalComponent, ModalProps, ModalResult } from './types';

/**
 * Сервис модальных окон
 */
export class Modals {
  // Слушатели изменений стека модалок
  protected readonly listeners: Set<() => void> = new Set();
  // Генератор ключей для окон
  protected readonly keyGenerator = codeGenerator();
  // Стек открытых окон
  protected stack: ModalsStack = [];

  constructor() {}

  /**
   * Открытие модалки
   * @param token Токен на компонент модалки
   * @param params Параметры модалки
   */
  open = async <Component extends ModalComponent>(
    token: Token<Component>,
    params?: ModalProps<Component>,
  ): Promise<ModalResult<Component>> => {
    return new Promise(resolve => {
      const key = this.keyGenerator();
      const state = {
        key,
        token,
        props: {
          ...(params || {}),
          close: (result: ModalResult<Component>) => {
            this.stack = this.stack.filter(stack => stack.key !== key);
            this.notify();
            resolve(result);
          },
        } as ComponentProps<Component>,
      } as ModalState<Component>;
      this.stack = [...this.stack, state];
      this.notify();
    });
  };

  getStack = () => {
    return this.stack;
  };

  /**
   * Подписка на изменение стека модалок.
   * Возвращается функция для отписки
   * @param listener
   */
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /**
   * Вызываем всех слушателей
   */
  protected notify = () => {
    this.listeners.forEach(listener => listener());
  };
}
