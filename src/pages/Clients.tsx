import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { ClientsHeader } from '@/components/clients/ClientsHeader';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { useClients } from '@/components/clients/useClients';

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { clients, loading, fetchClients, handleDelete } = useClients();

  return (
    <MainLayout>
      <div className="space-y-6">
        <ClientsHeader onClientAdded={fetchClients} />
        
        <ClientsTable
          clients={clients}
          loading={loading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onNavigate={(id) => navigate(`/clients/${id}`)}
          onDelete={handleDelete}
        />
      </div>
    </MainLayout>
  );
}