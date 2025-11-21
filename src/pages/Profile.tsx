import { MainLayout } from '@/components/layout/MainLayout';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PersonalInfoCard } from '@/components/profile/PersonalInfoCard';
import { useProfile } from '@/components/profile/useProfile';

export default function Profile() {
  const { user, handleUpdateProfile } = useProfile();

  return (
    <MainLayout>
      <div className="space-y-6">
        <ProfileHeader />

        <div className="grid gap-6 md:grid-cols-3">
          <PersonalInfoCard user={user} onUpdateProfile={handleUpdateProfile} />
        </div>
      </div>
    </MainLayout>
  );
}