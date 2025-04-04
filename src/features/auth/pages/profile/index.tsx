import { memo } from 'react';
import { useExternalState, useSolution } from 'react-solution';
import { useInit } from 'react-solution';
import { useTranslate } from 'react-solution';
import LocaleSelect from '@src/features/example-i18n/components/locale-select';
import AuthHead from '@src/features/auth/components/auth-head';
import SideLayout from '@src/ui/layout/side-layout';
import Head from '@src/ui/layout/head';
import MainMenu from '@src/features/navigation/components/main-menu';
import PageLayout from '@src/ui/layout/page-layout';
import ProfileCard from '@src/features/auth/components/profile-card';
import { PROFILE_STORE } from '../../profile-store/token.ts';

function ProfilePage() {
  const profile = useSolution(PROFILE_STORE);
  const profileState = useExternalState(profile.state);

  useInit(() => {
    profile.load();
  }, []);

  const t = useTranslate();

  return (
    <PageLayout>
      <Head title="React Solution">
        <SideLayout>
          <AuthHead />
          <LocaleSelect />
        </SideLayout>
      </Head>
      <MainMenu />
      <ProfileCard t={t} data={profileState.data || {}} />
    </PageLayout>
  );
}

export default memo(ProfilePage);
