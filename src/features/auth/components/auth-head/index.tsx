import { memo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useExternalState, useSolution } from 'react-solution';
import { useTranslate } from 'react-solution';
import { SESSION_STORE } from '../../session-store/token.ts';
import SideLayout from '@src/ui/layout/side-layout';

function AuthHead() {
  const t = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSolution(SESSION_STORE);
  const sessionState = useExternalState(session.state);

  const callbacks = {
    // Переход к авторизации
    onSignIn: useCallback(() => {
      navigate('/login', { state: { back: location.pathname } });
    }, [location.pathname]),

    // Отмена авторизации
    onSignOut: useCallback(() => {
      session.signOut();
    }, []),
  };

  return (
    <SideLayout side="end">
      {sessionState.user ? <Link to="/profile">{sessionState.user.profile.name}</Link> : ''}
      {sessionState.user ? (
        <button onClick={callbacks.onSignOut}>{t('auth.signOut')}</button>
      ) : (
        <button onClick={callbacks.onSignIn}>{t('auth.signIn')}</button>
      )}
    </SideLayout>
  );
}

export default memo(AuthHead);
