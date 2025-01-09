import { FormEvent, memo, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useExternalState, useTranslate } from 'react-solution';
import { useSolution } from 'react-solution';
import { SESSION_STORE } from '../../session-store/token.ts';
import Field from '@src/ui/elements/field';
import Input from '@src/ui/elements/input';
import type { SignInBody } from '../../users-api/types';

function LoginForm() {
  const t = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();
  const session = useSolution(SESSION_STORE);
  const sessionState = useExternalState(session.state);

  const [data, setData] = useState<SignInBody>({
    login: '',
    password: '',
    remember: true,
  });

  const callbacks = {
    // Колбэк на ввод в элементах формы
    onChange: useCallback((value: string, name: string) => {
      setData(prevData => ({ ...prevData, [name]: value }));
    }, []),

    // Отправка данных формы для авторизации
    onSubmit: useCallback(
      (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        session.signIn(data).then(success => {
          if (success) {
            // Возврат на страницу, с которой пришли
            const back =
              location.state?.back && location.state?.back !== location.pathname
                ? location.state?.back
                : '/';
            navigate(back);
          }
        });
      },
      [data, location.state],
    ),
  };

  return (
    <form onSubmit={callbacks.onSubmit}>
      <h2>{t('auth.loginForm.title')}</h2>
      <Field label={t('auth.loginForm.login')} error={sessionState.errors?.login}>
        <Input name="login" value={data.login} onChange={callbacks.onChange} />
      </Field>
      <Field label={t('auth.loginForm.password')} error={sessionState.errors?.password}>
        <Input
          name="password"
          type="password"
          value={data.password}
          onChange={callbacks.onChange}
        />
      </Field>
      <Field error={sessionState.errors?.other} />
      <Field>
        <button type="submit">{t('auth.signIn')}</button>
      </Field>
    </form>
  );
}

export default memo(LoginForm);
