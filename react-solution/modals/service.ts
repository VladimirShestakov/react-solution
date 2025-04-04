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

  /**
   * Закрытие модалки
   * Теоретически в функции нет необходимости, так как компонент модалки получает колбэк закрытия через свои свойства
   * @param result Результат модалки
   * @param key Ключ модалки. Если не указан, то закрывается последняя открытая.
   */
  close = <Component extends ModalComponent>(key: number, result: ModalResult<Component>) => {
    // Находим модалку в стеке и вызываем её close()
    let modalState: ModalState<Component> | undefined;
    if (key) {
      this.stack = this.stack.filter(stack => {
        if (stack.key === key) {
          modalState = stack as ModalState<Component>;
          return false;
        }
        return true;
      });
    } else {
      modalState = this.stack.at(-1) as ModalState<Component>;
    }
    if (modalState) {
      const close = modalState.props.close; // as ModalClose<TModalsResult[Name]>['close'];
      close(result);
    }
    this.notify();
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
