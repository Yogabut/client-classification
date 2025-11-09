import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ClientInformationCard } from '@/components/clientDetails/ClientInformationCard';
import { ClientTabsSection } from '@/components/clientDetails/ClientTabsSection';
import { UpdateStatusDialog } from '@/components/clientDetails/UpdateStatusDialog';
import { useClientData } from '@/components/clientDetails/useClientData';

export default function ClientDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const {
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
  } = useClientData(id);

  useEffect(() => {
    if (id) {
      fetchClient();
      fetchInteractions();
      fetchAttachments();
    }
  }, [id]);

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
          
          <UpdateStatusDialog
            client={client}
            isOpen={isStatusDialogOpen}
            onOpenChange={setIsStatusDialogOpen}
            onUpdateStatus={updateClientStatus}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <ClientInformationCard client={client} />
          
          <ClientTabsSection
            client={client}
            interactions={interactions}
            attachments={attachments}
            user={user}
            onAddInteraction={addInteraction}
            onUpdateInteraction={updateInteraction}
            onDeleteInteraction={deleteInteraction}
            onUploadFile={uploadFile}
            onDownloadFile={downloadFile}
            onDeleteFile={deleteFile}
          />
        </div>
      </div>
    </MainLayout>
  );
}