import { Token } from '@packages/token';
import type { ComponentType, MemoExoticComponent, ComponentProps } from 'react';

/**
 * Свойства модалки с колбэком закрытия
 * Для определения props в компоненте модалки
 */
export interface ModalWithClose<Result = boolean> {
  close: (result: Result) => void;
}

export type ModalComponent<Props = any> = ComponentType<Props> | MemoExoticComponent<ComponentType<Props>>

export type ModalProps<Component extends ModalComponent> = Omit<ComponentProps<Component>, 'close'>

export type ModalResult<Component extends ModalComponent> = ComponentProps<Component> extends { close: (result: infer R) => any } ? R : void

/**
 * Состояние открытой модалки в стеке
 */
export type ModalState<Component extends ModalComponent> = {
  key: number,
  token: Token<Component>,
  props: ModalProps<Component>,
}
/**
 * Стек открытых модалок
 */
export type ModalsStack = ModalState<any>[];
