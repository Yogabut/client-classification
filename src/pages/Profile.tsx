import { MainLayout } from '@/components/layout/MainLayout';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PersonalInfoCard } from '@/components/profile/PersonalInfoCard';
import { ActivityLogCard } from '@/components/profile/ActivityLogCard';
import { useProfile } from '@/components/profile/useProfile';

export default function Profile() {
  const { user, activityLogs, loading, handleUpdateProfile } = useProfile();

  return (
    <MainLayout>
      <div className="space-y-6">
        <ProfileHeader />

        <div className="grid gap-6 md:grid-cols-3">
          <PersonalInfoCard user={user} onUpdateProfile={handleUpdateProfile} />
          <ActivityLogCard logs={activityLogs} loading={loading} />
        </div>
      </div>
    </MainLayout>
  );
}