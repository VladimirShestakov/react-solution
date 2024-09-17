import { useContainer } from '@packages/container/use-container.ts';
import { memo, useSyncExternalStore } from 'react';
import { MODALS } from './token.ts';

/**
 * Отображает стек открытых модальных окон
 */
function ModalsContainer() {
  const container = useContainer();

  const modals = container.getWithSuspense(MODALS);
  const modalsStack = useSyncExternalStore(modals.subscribe, modals.getStack, modals.getStack);

  return <>{modalsStack.map(state => {
    // @todo Для ожидания компонента не использовать корневой Suspense, а реализовать спиннер открытия модалки.
    const ModalComponent = container.getWithSuspense(state.token);
    // Почему-то state.props не сопоставляется с компонентом модалки. Поэтому применён any
    return ModalComponent ? <ModalComponent key={state.key} {...state.props as any}/> : null;
  })}</>;
}

export default memo(ModalsContainer);
