import { memo } from 'react';
import Head from '@src/ui/layout/head';
import PageLayout from '@src/ui/layout/page-layout';
// @todo Используется другая фича, нужно сделать слабую связь на неё.
import MainMenu from '@src/features/navigation/components/main-menu';
import LocaleSelect from '@src/features/example-i18n/components/locale-select';
import LoginForm from '../../components/login-form';

function LoginPage() {
  return (
    <PageLayout>
      <Head title="React Skeleton">
        <LocaleSelect />
      </Head>
      <MainMenu />
      <p>
        Страница или раздел, требующий авторизацию. При отсутствии авторизованной сессии,
        выполняется редирект к форме авторизации. В шапке сайта выводится информация про сессию -
        имя авторизованного пользователя и кнопка для выхода (сброса сессии). Токен сессии
        сохраняется в LocalStorage или в куку для автоматического восстановления сессии. Проверка и
        восстановление сессии выполнится при попытке перейти в раздел, требующий авторизацию. Или в
        корне приложения, чтобы сразу показывать актуальную информацию о сессии в шапке на каждой
        странице сайте.
      </p>
      <LoginForm />
    </PageLayout>
  );
}

export default memo(LoginPage);
