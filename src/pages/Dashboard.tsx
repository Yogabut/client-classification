import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ClientsStatusChart } from '@/components/dashboard/ClientsStatusChart';
import { ClientsIndustryChart } from '@/components/dashboard/ClientsIndustryChart';
import { ClientsCountryCard } from '@/components/dashboard/ClientsCountryCard';
import { RecentClientsTable } from '@/components/dashboard/RecentClientsTable';
import { ActivityLogCard } from '@/components/profile/ActivityLogCard';
import { useDashboard } from '@/components/dashboard/useDashboard';
import { useProfile } from '@/components/profile/useProfile';

export default function Dashboard() {
  const { clients, stats, statusData, industryData, loading } = useDashboard();
  const { activityLogs } = useProfile();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header & Stats */}
        <DashboardHeader />
        <StatsGrid stats={stats} />

        {/* Row 1: Status + Country */}
        <div className="grid gap-6 md:grid-cols-2">
          <ClientsStatusChart statusData={statusData} loading={loading} />
          <ClientsCountryCard />
        </div>

        {/* Row 2: Industry + Activity Log */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT SIDE: Industry + Recent Table */}
          <div className="lg:col-span-2 space-y-6">
            <ClientsIndustryChart industryData={industryData} loading={loading} />
            <RecentClientsTable clients={clients} loading={loading} />
          </div>

          {/* RIGHT SIDE: Activity Log */}
          <ActivityLogCard logs={activityLogs} loading={loading} />
        </div>
      </div>
    </MainLayout>
  );
}
