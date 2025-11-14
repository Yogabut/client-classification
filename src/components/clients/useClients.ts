/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string;
  industry: string;
  status: string;
  revenue: number;
  assigned_user_id: string | null;
  profiles?: { name: string } | null;
}

export interface FilterValues {
  country: string;
  industry: string;
  status: string;
  assignedTo: string;
  revenueRange: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues>({
    country: 'all',
    industry: 'all',
    status: 'all',
    assignedTo: 'all',
    revenueRange: 'all',
  });

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*, profiles(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch clients');
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClients(clients.filter(c => c.id !== id));
      toast.success('Client deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete client');
      console.error('Error deleting client:', error);
    }
  };

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      country: 'all',
      industry: 'all',
      status: 'all',
      assignedTo: 'all',
      revenueRange: 'all',
    });
  };

  // Apply filters
  const getFilteredClients = (clientsList: Client[]) => {
    return clientsList.filter(client => {
      // Country filter
      if (filters.country !== 'all' && client.country !== filters.country) {
        return false;
      }

      // Industry filter
      if (filters.industry !== 'all' && client.industry !== filters.industry) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && client.status !== filters.status) {
        return false;
      }

      // Assigned To filter
      if (filters.assignedTo !== 'all') {
        if (filters.assignedTo === 'unassigned' && client.assigned_user_id !== null) {
          return false;
        }
        if (filters.assignedTo !== 'unassigned' && client.assigned_user_id !== filters.assignedTo) {
          return false;
        }
      }

      // Revenue Range filter
      if (filters.revenueRange !== 'all') {
        const revenue = client.revenue || 0;
        const [min, max] = filters.revenueRange.split('-').map(v => 
          v.includes('+') ? Infinity : parseInt(v)
        );
        if (revenue < min || revenue > max) {
          return false;
        }
      }

      return true;
    });
  };

  useEffect(() => {
    fetchClients();
    fetchUsers();
  }, []);

  // Get unique values for filter options
  const countries = [...new Set(clients.map(c => c.country))].sort();
  const industries = [...new Set(clients.map(c => c.industry))].sort();

  return {
    clients,
    users,
    loading,
    filters,
    countries,
    industries,
    fetchClients,
    handleDelete,
    handleFilterChange,
    clearFilters,
    getFilteredClients,
  };
};