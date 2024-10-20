import { memo, useSyncExternalStore } from 'react';
import { CONTAINER, useSolution } from '../container';
import { MODALS } from './token';

/**
 * Отображает стек открытых модальных окон
 */
function Modals() {
  const solutions = useSolution(CONTAINER);

  const modals = solutions.getWithSuspense(MODALS);
  const modalsStack = useSyncExternalStore(modals.subscribe, modals.getStack, modals.getStack);

  return (
    <>
      {modalsStack.map(state => {
        // @todo Для ожидания компонента не использовать корневой Suspense, а реализовать спиннер открытия модалки.
        const ModalComponent = solutions.getWithSuspense(state.token);
        // Почему-то state.props не сопоставляется с компонентом модалки. Поэтому применён any
        return ModalComponent ? <ModalComponent key={state.key} {...(state.props as any)} /> : null;
      })}
    </>
  );
}

export const ModalsContainer = memo(Modals);
