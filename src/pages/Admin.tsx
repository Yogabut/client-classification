import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Activity } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { UsersTable } from '@/components/admin/UsersTable';
import { ActivityLogsList } from '@/components/admin/ActivityLogsList';
import { useAdmin } from '@/components/admin/useAdmin';

export default function Admin() {
  const { users, activityLogs, loading } = useAdmin();

  return (
    <MainLayout>
      <div className="space-y-6">
        <AdminHeader />

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="h-4 w-4" />
              Activity Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersTable users={users} loading={loading} />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityLogsList logs={activityLogs} loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}