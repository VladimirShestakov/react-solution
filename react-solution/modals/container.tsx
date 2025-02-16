import { memo, useSyncExternalStore } from 'react';
import { SOLUTIONS, useSolution } from '../solutions';
import { MODALS } from './token';

/**
 * Отображает открытые модальные окна
 */
function Modals() {
  const solutions = useSolution(SOLUTIONS);
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
