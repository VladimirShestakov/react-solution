import useService from '@packages/container/use-service.ts';
import { SESSION_STORE } from '../../session-store/token.ts';
import { memo, ReactNode, useEffect, useSyncExternalStore } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useInit from '@src/services/use-init';

interface Props {
  children: ReactNode,
  redirect: string
}

function Protected({ children, redirect }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useService(SESSION_STORE);
  const sessionState = useSyncExternalStore(session.state.subscribe, session.state.get, session.state.get);

  useInit(async () => {
    // Вызывается даже если есть сессиия в целях её акутализации
    // Вызов происходит при переходе в роут с друго пути
    await session.remind();
  });

  useEffect(() => {
    if (!sessionState.user && !sessionState.waiting) {
      navigate(redirect, { state: { back: location.pathname } });
    }
  }, [sessionState.user, sessionState.waiting]);

  if (!sessionState.user || sessionState.waiting) {
    return <div>Ждём...</div>;
  } else {
    return children;
  }
}

export default memo(Protected);
