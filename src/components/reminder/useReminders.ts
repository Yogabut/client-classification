/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Task, Client, TaskFormData } from './types';

export const useReminders = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, clients(name)')
        .order('due_date', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleMarkDone = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'completed' })
        .eq('id', id);

      if (error) throw error;

      setTasks(tasks.map(task =>
        task.id === id ? { ...task, status: 'completed' } : task
      ));
      toast.success('Task marked as completed');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks(tasks.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleAddTask = async (taskData: TaskFormData) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          user_id: user?.id,
          status: 'pending',
        }])
        .select('*, clients(name)')
        .single();

      if (error) throw error;

      setTasks([data, ...tasks]);
      toast.success('Task added successfully');
      return true;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
      return false;
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchClients();
  }, []);

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return {
    tasks,
    clients,
    loading,
    pendingTasks,
    completedTasks,
    handleMarkDone,
    handleDeleteTask,
    handleAddTask,
  };
};