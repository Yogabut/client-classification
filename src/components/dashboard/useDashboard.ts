import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Client {
  id: string;
  name: string;
  country: string;
  industry: string;
  status: string;
  last_contact: string | null;
  profiles?: { name: string } | null;
}

export interface DashboardStats {
  totalClients: number;
  activeDeals: number;
  conversionRate: number;
  totalRevenue: number;
}

export interface StatusData {
  name: string;
  value: number;
}

export const useDashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeDeals: 0,
    conversionRate: 0,
    totalRevenue: 0,
  });
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Setup realtime subscription
  useEffect(() => {
    fetchDashboardData();

    const channel = supabase
      .channel('clients-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'clients'
        },
        (payload) => {
          console.log('New client added:', payload);
          toast.success(`New client "${payload.new.name}" has been added!`);
          fetchDashboardData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'clients'
        },
        (payload) => {
          console.log('Client updated:', payload);
          const oldStatus = payload.old.status;
          const newStatus = payload.new.status;
          
          if (oldStatus !== newStatus) {
            toast.info(`Client "${payload.new.name}" status changed from ${oldStatus} to ${newStatus}`);
          }
          fetchDashboardData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'clients'
        },
        (payload) => {
          console.log('Client deleted:', payload);
          toast.info(`Client "${payload.old.name}" has been deleted`);
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    clients,
    stats,
    statusData,
    loading,
  };
};