// src/components/clientDetails/useClientData.ts

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Client, Interaction, Attachment } from './types';

export const useClientData = (clientId: string | undefined) => {
  const [client, setClient] = useState<Client | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClient = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) throw error;
      setClient(data);
    } catch (error) {
      console.error('Error fetching client:', error);
      toast.error('Failed to load client details');
    } finally {
      setLoading(false);
    }
  };

  const fetchInteractions = async () => {
    try {
      const { data: interactionsData, error: interactionsError } = await supabase
        .from('interactions')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (interactionsError) throw interactionsError;

      const userIds = [...new Set(interactionsData?.map(i => i.user_id) || [])];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      const enrichedInteractions = interactionsData?.map(interaction => ({
        ...interaction,
        profiles: profilesMap.get(interaction.user_id) || null,
      })) || [];

      setInteractions(enrichedInteractions);
    } catch (error) {
      console.error('Error fetching interactions:', error);
      toast.error('Failed to load interactions');
    }
  };

  const fetchAttachments = async () => {
    try {
      const { data, error } = await supabase
        .from('attachments')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttachments(data || []);
    } catch (error) {
      console.error('Error fetching attachments:', error);
      toast.error('Failed to load attachments');
    }
  };

  const updateClientStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ status: newStatus })
        .eq('id', clientId);

      if (error) throw error;

      setClient(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success(`Client status updated to ${newStatus}`);
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update client status');
      return false;
    }
  };

  const addInteraction = async (type: string, note: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('interactions')
        .insert([{
          client_id: clientId,
          user_id: userId,
          type,
          note,
        }])
        .select()
        .single();

      if (error) throw error;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('id', userId)
        .single();

      const enrichedInteraction = {
        ...data,
        profiles: profileData || null,
      };

      setInteractions([enrichedInteraction, ...interactions]);
      toast.success('Interaction logged successfully');

      // Send email notification
      if (client) {
        try {
          await supabase.functions.invoke('send-interaction-notification', {
            body: {
              clientName: client.name,
              clientEmail: client.email,
              interactionType: type,
              interactionNote: note,
              userName: profileData?.name || 'Unknown User',
            },
          });
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
        }
      }

      return true;
    } catch (error) {
      console.error('Error adding interaction:', error);
      toast.error('Failed to log interaction');
      return false;
    }
  };

  const updateInteraction = async (interactionId: string, type: string, note: string) => {
    try {
      const { error } = await supabase
        .from('interactions')
        .update({ type, note })
        .eq('id', interactionId);

      if (error) throw error;

      await fetchInteractions();
      toast.success('Interaction updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating interaction:', error);
      toast.error('Failed to update interaction');
      return false;
    }
  };

  const deleteInteraction = async (interactionId: string) => {
    try {
      const { error } = await supabase
        .from('interactions')
        .delete()
        .eq('id', interactionId);

      if (error) throw error;

      setInteractions(interactions.filter(i => i.id !== interactionId));
      toast.success('Interaction deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting interaction:', error);
      toast.error('Failed to delete interaction');
      return false;
    }
  };

  const uploadFile = async (file: File, description: string, userId: string) => {
    try {
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('client-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data, error: dbError } = await supabase
        .from('attachments')
        .insert([{
          client_id: clientId,
          user_id: userId,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          description: description || null,
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      setAttachments([data, ...attachments]);
      toast.success('File uploaded successfully');
      return true;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      return false;
    }
  };

  const downloadFile = async (attachment: Attachment) => {
    try {
      const { data, error } = await supabase.storage
        .from('client-attachments')
        .download(attachment.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('File downloaded successfully');
      return true;
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
      return false;
    }
  };

  const deleteFile = async (attachment: Attachment) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('client-attachments')
        .remove([attachment.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('attachments')
        .delete()
        .eq('id', attachment.id);

      if (dbError) throw dbError;

      setAttachments(attachments.filter(a => a.id !== attachment.id));
      toast.success('File deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
      return false;
    }
  };

  return {
    client,
    interactions,
    attachments,
    loading,
    fetchClient,
    fetchInteractions,
    fetchAttachments,
    updateClientStatus,
    addInteraction,
    updateInteraction,
    deleteInteraction,
    uploadFile,
    downloadFile,
    deleteFile,
  };
};