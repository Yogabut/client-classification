import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, MapPin, Building, DollarSign, Upload, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function ClientDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isInteractionDialogOpen, setIsInteractionDialogOpen] = useState(false);
  const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false);
  const [clientStatus, setClientStatus] = useState('Active');

  const client = {
    id,
    name: 'Acme Corp',
    email: 'contact@acme.com',
    phone: '+1 (555) 123-4567',
    country: 'USA',
    industry: 'Technology',
    status: 'Active',
    potentialValue: 50000,
    assignedTo: 'John Doe',
    address: '123 Business St, New York, NY 10001',
  };


  const [attachments, setAttachments] = useState([
    { id: 1, name: 'Proposal_Q1_2024.pdf', size: '2.4 MB', date: '2024-01-15' },
    { id: 2, name: 'Contract_Draft.docx', size: '1.1 MB', date: '2024-01-10' },
  ]);

  const [interactions, setInteractions] = useState([
    { id: 1, date: '2024-01-15', type: 'Email', note: 'Sent proposal for Q1 2024', user: 'John Doe' },
    { id: 2, date: '2024-01-10', type: 'Call', note: 'Discussed project requirements', user: 'John Doe' },
    { id: 3, date: '2024-01-05', type: 'Meeting', note: 'Initial consultation meeting', user: 'Jane Smith' },
  ]);

  const handleStatusUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStatus = formData.get('status') as string;
    setClientStatus(newStatus);
    toast.success(`Client status updated to ${newStatus}`);
    setIsStatusDialogOpen(false);
  };

  const handleAddInteraction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newInteraction = {
      id: interactions.length + 1,
      date: new Date().toISOString().split('T')[0],
      type: formData.get('type') as string,
      note: formData.get('note') as string,
      user: 'Current User',
    };
    setInteractions([newInteraction, ...interactions]);
    toast.success('Interaction logged successfully');
    setIsInteractionDialogOpen(false);
  };

  const handleFileUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    if (file) {
      const newAttachment = {
        id: attachments.length + 1,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        date: new Date().toISOString().split('T')[0],
      };
      setAttachments([...attachments, newAttachment]);
      toast.success('File uploaded successfully');
      setIsAttachmentDialogOpen(false);
    }
  };

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
                  <Select name="status" defaultValue={clientStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lead">Lead</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
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
                  <p className="text-sm text-muted-foreground">Potential Value</p>
                  <p className="font-medium">${client.potentialValue.toLocaleString()}</p>
                </div>
              </div>
              <div className="pt-4">
                <Badge className={`${
                  clientStatus === 'Active' ? 'bg-success' :
                  clientStatus === 'Lead' ? 'bg-primary' :
                  clientStatus === 'Pending' ? 'bg-warning' :
                  'bg-muted'
                }`}>{clientStatus}</Badge>
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
                  <div className="flex justify-end mb-4">
                    <Dialog open={isInteractionDialogOpen} onOpenChange={setIsInteractionDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Log Interaction
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Log New Interaction</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddInteraction} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="type">Interaction Type</Label>
                            <Select name="type" required>
                              <SelectTrigger>
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
                            <Label htmlFor="note">Details</Label>
                            <Textarea
                              id="note"
                              name="note"
                              placeholder="What happened during this interaction?"
                              rows={4}
                              required
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsInteractionDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Log Interaction</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {interactions.map((interaction) => (
                    <div key={interaction.id} className="border-l-2 border-primary pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{interaction.type}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {interaction.date}
                        </span>
                      </div>
                      <p className="font-medium">{interaction.note}</p>
                      <p className="text-sm text-muted-foreground">by {interaction.user}</p>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="attachments" className="space-y-4">
                  <div className="flex justify-end mb-4">
                    <Dialog open={isAttachmentDialogOpen} onOpenChange={setIsAttachmentDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
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
                            <Label htmlFor="file">Select File</Label>
                            <Input
                              id="file"
                              name="file"
                              type="file"
                              required
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                            />
                            <p className="text-xs text-muted-foreground">
                              Supported formats: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                              id="description"
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
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{attachment.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {attachment.size} • {attachment.date}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
