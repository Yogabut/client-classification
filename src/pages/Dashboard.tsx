import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ClientsStatusChart } from '@/components/dashboard/ClientsStatusChart';
import { ClientsCountryCard } from '@/components/dashboard/ClientsCountryCard';
import { RecentClientsTable } from '@/components/dashboard/RecentClientsTable';
import { useDashboard } from '@/components/dashboard/useDashboard';

export default function Dashboard() {
  const { clients, stats, statusData, loading } = useDashboard();

  return (
    <MainLayout>
      <div className="space-y-6">
        <DashboardHeader />

        <StatsGrid stats={stats} />

        <div className="grid gap-4 md:grid-cols-2">
          <ClientsStatusChart statusData={statusData} loading={loading} />
          <ClientsCountryCard />
        </div>

        <RecentClientsTable clients={clients} loading={loading} />
      </div>
    </MainLayout>
  );
}