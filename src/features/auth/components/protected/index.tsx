import { memo, ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useExternalState, useSolution } from 'react-solution';
import { useInit } from 'react-solution';
import { SESSION_STORE } from '../../session-store/token.ts';

interface Props {
  children: ReactNode;
  redirect: string;
}

function Protected({ children, redirect }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSolution(SESSION_STORE);
  const sessionState = useExternalState(session.state);

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
