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
  notes: string | null;
  assigned_user_id: string | null;
  profiles?: { name: string } | null;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    fetchClients,
    handleDelete,
  };
};