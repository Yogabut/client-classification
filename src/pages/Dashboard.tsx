import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, DollarSign, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CountryMap } from '@/components/CountryMap';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Client {
  id: string;
  name: string;
  country: string;
  industry: string;
  status: string;
  last_contact: string | null;
  profiles?: { name: string } | null;
}

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeDeals: 0,
    conversionRate: 0,
    totalRevenue: 0,
  });
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*, profiles(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      // Fetch all clients for statistics
      const { data: allClients, error: allError } = await supabase
        .from('clients')
        .select('status, revenue');

      if (allError) throw allError;

      setClients(data || []);

      // Calculate statistics
      const total = allClients?.length || 0;
      const active = allClients?.filter(c => c.status === 'active').length || 0;
      const conversion = total > 0 ? Math.round((active / total) * 100) : 0;
      const totalRevenue = allClients?.reduce((sum, client) => sum + (client.revenue || 0), 0) || 0;

      setStats({
        totalClients: total,
        activeDeals: active,
        conversionRate: conversion,
        totalRevenue,
      });

      // Group by status for chart
      const statusGroups = allClients?.reduce((acc, client) => {
        const status = client.status.charAt(0).toUpperCase() + client.status.slice(1);
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const chartData = Object.entries(statusGroups || {}).map(([name, value]) => ({
        name,
        value,
      }));

      setStatusData(chartData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRevenue = (revenue: number) => {
    if (revenue >= 1000000) return `$${(revenue / 1000000).toFixed(1)}M`;
    if (revenue >= 1000) return `$${(revenue / 1000).toFixed(1)}K`;
    return `$${revenue.toFixed(0)}`;
  };

  const statsCards = [
    { title: 'Total Clients', value: stats.totalClients.toString(), icon: Users, change: '+12.5%', color: 'text-primary' },
    { title: 'Active Deals', value: stats.activeDeals.toString(), icon: Target, change: '+8.2%', color: 'text-success' },
    { title: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: TrendingUp, change: '+4.3%', color: 'text-accent' },
    { title: 'Revenue', value: formatRevenue(stats.totalRevenue), icon: DollarSign, change: '+18.7%', color: 'text-warning' },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'negotiation':
        return 'bg-primary/10 text-primary';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your CRM today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-success">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Clients by Status</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Loading chart...
                </div>
              ) : statusData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No client data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clients by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <CountryMap />
            </CardContent>
          </Card>
        </div>

        {/* Recent Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading clients...</div>
            ) : clients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No clients yet. Add your first client to get started!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Name</th>
                      <th className="text-left p-2 font-medium">Country</th>
                      <th className="text-left p-2 font-medium">Industry</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Last Contact</th>
                      <th className="text-left p-2 font-medium">Assigned To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-2 font-medium">{client.name}</td>
                        <td className="p-2">{client.country}</td>
                        <td className="p-2">{client.industry}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="p-2">
                          {client.last_contact ? format(new Date(client.last_contact), 'MMM dd, yyyy') : 'Never'}
                        </td>
                        <td className="p-2">{client.profiles?.name || 'Unassigned'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
