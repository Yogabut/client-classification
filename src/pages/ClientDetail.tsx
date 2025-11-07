import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, MapPin, Building, DollarSign, Plus, Trash2, Edit, Upload, Download, Filter } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string;
  industry: string;
  status: string;
  revenue: number;
  notes: string | null;
}

interface Interaction {
  id: string;
  type: string;
  note: string;
  created_at: string;
  user_id: string;
  profiles?: { name: string } | null;
}

interface Attachment {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  description: string | null;
  created_at: string;
  user_id: string;
}

export default function ClientDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [filteredInteractions, setFilteredInteractions] = useState<Interaction[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isInteractionDialogOpen, setIsInteractionDialogOpen] = useState(false);
  const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchClient();
      fetchInteractions();
      fetchAttachments();
    }
  }, [id]);

  useEffect(() => {
    applyFilters();
  }, [interactions, filterType, filterDateFrom, filterDateTo]);

  const fetchClient = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
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
        .eq('client_id', id)
        .order('created_at', { ascending: false });

      if (interactionsError) throw interactionsError;

      // Fetch profiles separately
      const userIds = [...new Set(interactionsData?.map(i => i.user_id) || [])];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Join profiles with interactions
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
        .eq('client_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttachments(data || []);
    } catch (error) {
      console.error('Error fetching attachments:', error);
      toast.error('Failed to load attachments');
    }
  };

  const applyFilters = () => {
    let filtered = [...interactions];

    if (filterType !== 'all') {
      filtered = filtered.filter(i => i.type === filterType);
    }

    if (filterDateFrom) {
      filtered = filtered.filter(i => new Date(i.created_at) >= new Date(filterDateFrom));
    }

    if (filterDateTo) {
      filtered = filtered.filter(i => new Date(i.created_at) <= new Date(filterDateTo));
    }

    setFilteredInteractions(filtered);
  };

  const handleStatusUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStatus = formData.get('status') as 'active' | 'inactive' | 'negotiation' | 'pending';

    try {
      const { error } = await supabase
        .from('clients')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setClient(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success(`Client status updated to ${newStatus}`);
      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update client status');
    }
  };

  const handleAddInteraction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const { data, error } = await supabase
        .from('interactions')
        .insert([{
          client_id: id,
          user_id: user?.id,
          type: formData.get('type') as string,
          note: formData.get('note') as string,
        }])
        .select()
        .single();

      if (error) throw error;

      // Fetch profile for the new interaction
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('id', user?.id)
        .single();

      const enrichedInteraction = {
        ...data,
        profiles: profileData || null,
      };

      setInteractions([enrichedInteraction, ...interactions]);
      toast.success('Interaction logged successfully');
      setIsInteractionDialogOpen(false);
      e.currentTarget.reset();

      // Send email notification
      if (client) {
        try {
          await supabase.functions.invoke('send-interaction-notification', {
            body: {
              clientName: client.name,
              clientEmail: client.email,
              interactionType: formData.get('type') as string,
              interactionNote: formData.get('note') as string,
              userName: profileData?.name || 'Unknown User',
            },
          });
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
        }
      }
    } catch (error) {
      console.error('Error adding interaction:', error);
      toast.error('Failed to log interaction');
    }
  };

  const handleEditInteraction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingInteraction) return;

    const formData = new FormData(e.currentTarget);

    try {
      const { error } = await supabase
        .from('interactions')
        .update({
          type: formData.get('type') as string,
          note: formData.get('note') as string,
        })
        .eq('id', editingInteraction.id);

      if (error) throw error;

      await fetchInteractions();
      toast.success('Interaction updated successfully');
      setEditingInteraction(null);
      setIsInteractionDialogOpen(false);
    } catch (error) {
      console.error('Error updating interaction:', error);
      toast.error('Failed to update interaction');
    }
  };

  const handleDeleteInteraction = async (interactionId: string) => {
    if (!confirm('Are you sure you want to delete this interaction?')) return;

    try {
      const { error } = await supabase
        .from('interactions')
        .delete()
        .eq('id', interactionId);

      if (error) throw error;

      setInteractions(interactions.filter(i => i.id !== interactionId));
      toast.success('Interaction deleted successfully');
    } catch (error) {
      console.error('Error deleting interaction:', error);
      toast.error('Failed to delete interaction');
    }
  };

  const openEditDialog = (interaction: Interaction) => {
    setEditingInteraction(interaction);
    setIsInteractionDialogOpen(true);
  };

  const closeInteractionDialog = () => {
    console.log('Closing interaction dialog');
    setEditingInteraction(null);
    setIsInteractionDialogOpen(false);
  };

  const openInteractionDialog = () => {
    console.log('Opening interaction dialog');
    setEditingInteraction(null);
    setIsInteractionDialogOpen(true);
  };

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;

    if (!file || !user || !id) return;

    try {
      // Upload file to storage
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('client-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create attachment record
      const { data, error: dbError } = await supabase
        .from('attachments')
        .insert([{
          client_id: id,
          user_id: user.id,
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
      setIsAttachmentDialogOpen(false);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  };

  const handleDownloadFile = async (attachment: Attachment) => {
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
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const handleDeleteFile = async (attachment: Attachment) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('client-attachments')
        .remove([attachment.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('attachments')
        .delete()
        .eq('id', attachment.id);

      if (dbError) throw dbError;

      setAttachments(attachments.filter(a => a.id !== attachment.id));
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const clearFilters = () => {
    setFilterType('all');
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading client details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!client) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">Client not found</p>
          <Button onClick={() => navigate('/clients')}>Back to Clients</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/clients')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{client.name}</h1>
              <p className="text-muted-foreground">Client Details</p>
            </div>
          </div>
          
          <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
            <DialogTrigger asChild>
              <Button>Update Status</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Client Status</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleStatusUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={client.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Textarea
                    id="note"
                    name="note"
                    placeholder="Add a note about this status change..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Status</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{client.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p className="font-medium">{client.industry}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="font-medium">${client.revenue?.toLocaleString() || 0}</p>
                </div>
              </div>
              <div className="pt-4">
                <Badge className={`${
                  client.status === 'active' ? 'bg-success' :
                  client.status === 'pending' ? 'bg-warning' :
                  client.status === 'negotiation' ? 'bg-primary' :
                  'bg-muted'
                }`}>{client.status}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <Tabs defaultValue="interactions">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="interactions">Interactions</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                </TabsList>
                <TabsContent value="interactions" className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="mr-2 h-4 w-4" />
                          Filters
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={filterType} onValueChange={setFilterType}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Email">Email</SelectItem>
                                <SelectItem value="Call">Call</SelectItem>
                                <SelectItem value="Meeting">Meeting</SelectItem>
                                <SelectItem value="Note">Note</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Date From</Label>
                            <Input
                              type="date"
                              value={filterDateFrom}
                              onChange={(e) => setFilterDateFrom(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Date To</Label>
                            <Input
                              type="date"
                              value={filterDateTo}
                              onChange={(e) => setFilterDateTo(e.target.value)}
                            />
                          </div>
                          <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                            Clear Filters
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <div className="ml-auto">
                      <Dialog open={isInteractionDialogOpen} onOpenChange={(open) => {
                        console.log('Interaction dialog state change:', open);
                        if (!open) {
                          closeInteractionDialog();
                        } else {
                          setIsInteractionDialogOpen(true);
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => {
                            console.log('Log Interaction button clicked');
                            openInteractionDialog();
                          }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Log Interaction
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {editingInteraction ? 'Edit Interaction' : 'Log New Interaction'}
                            </DialogTitle>
                          </DialogHeader>
                          <form onSubmit={editingInteraction ? handleEditInteraction : handleAddInteraction} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="interaction-type">Interaction Type</Label>
                              <Select name="type" defaultValue={editingInteraction?.type} required>
                                <SelectTrigger id="interaction-type">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Email">Email</SelectItem>
                                  <SelectItem value="Call">Call</SelectItem>
                                  <SelectItem value="Meeting">Meeting</SelectItem>
                                  <SelectItem value="Note">Note</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="interaction-note">Details</Label>
                              <Textarea
                                id="interaction-note"
                                name="note"
                                defaultValue={editingInteraction?.note}
                                placeholder="What happened during this interaction?"
                                rows={4}
                                required
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button type="button" variant="outline" onClick={closeInteractionDialog}>
                                Cancel
                              </Button>
                              <Button type="submit">
                                {editingInteraction ? 'Update' : 'Log Interaction'}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  {filteredInteractions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      {interactions.length === 0 ? 'No interactions logged yet' : 'No interactions match your filters'}
                    </p>
                  ) : (
                    filteredInteractions.map((interaction) => (
                      <div key={interaction.id} className="border-l-2 border-primary pl-4 py-2 relative group">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{interaction.type}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(interaction.created_at), 'MMM dd, yyyy HH:mm')}
                            </span>
                          </div>
                          {interaction.user_id === user?.id && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openEditDialog(interaction)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDeleteInteraction(interaction.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="font-medium">{interaction.note}</p>
                        <p className="text-sm text-muted-foreground">
                          by {interaction.profiles?.name || 'Unknown User'}
                        </p>
                      </div>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="attachments" className="space-y-4">
                  <div className="flex justify-end mb-4">
                    <Dialog open={isAttachmentDialogOpen} onOpenChange={(open) => {
                      console.log('Attachment dialog state change:', open);
                      setIsAttachmentDialogOpen(open);
                    }}>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => {
                          console.log('Upload File button clicked');
                          setIsAttachmentDialogOpen(true);
                        }}>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload File
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Upload Attachment</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleFileUpload} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="attachment-file">Select File</Label>
                            <Input
                              id="attachment-file"
                              name="file"
                              type="file"
                              required
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                            />
                            <p className="text-xs text-muted-foreground">
                              Max size: 20MB. Supported: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="attachment-description">Description (Optional)</Label>
                            <Textarea
                              id="attachment-description"
                              name="description"
                              placeholder="Brief description of this file..."
                              rows={3}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsAttachmentDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Upload</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {attachments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No attachments uploaded yet
                    </p>
                  ) : (
                    attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <p className="font-medium">{attachment.file_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(attachment.file_size / 1024).toFixed(1)} KB • {format(new Date(attachment.created_at), 'MMM dd, yyyy')}
                          </p>
                          {attachment.description && (
                            <p className="text-sm text-muted-foreground mt-1">{attachment.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadFile(attachment)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {attachment.user_id === user?.id && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDeleteFile(attachment)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
