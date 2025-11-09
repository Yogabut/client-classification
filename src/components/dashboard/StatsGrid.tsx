import { Users, TrendingUp, DollarSign, Target } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { DashboardStats } from './useDashboard';

interface StatsGridProps {
  stats: DashboardStats;
}

const formatRevenue = (revenue: number) => {
  if (revenue >= 1000000) return `$${(revenue / 1000000).toFixed(1)}M`;
  if (revenue >= 1000) return `$${(revenue / 1000).toFixed(1)}K`;
  return `$${revenue.toFixed(0)}`;
};

export const StatsGrid = ({ stats }: StatsGridProps) => {
  const statsCards = [
    { 
      title: 'Total Clients', 
      value: stats.totalClients.toString(), 
      icon: Users, 
      change: '+12.5%', 
      color: 'text-primary' 
    },
    { 
      title: 'Active Deals', 
      value: stats.activeDeals.toString(), 
      icon: Target, 
      change: '+8.2%', 
      color: 'text-success' 
    },
    { 
      title: 'Conversion Rate', 
      value: `${stats.conversionRate}%`, 
      icon: TrendingUp, 
      change: '+4.3%', 
      color: 'text-accent' 
    },
    { 
      title: 'Revenue', 
      value: formatRevenue(stats.totalRevenue), 
      icon: DollarSign, 
      change: '+18.7%', 
      color: 'text-warning' 
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};