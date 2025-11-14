import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { ClientsHeader } from '@/components/clients/ClientsHeader';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { useClients } from '@/components/clients/useClients';

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const {
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
  } = useClients();


  const filteredClients = getFilteredClients(clients);

  return (
    <MainLayout>
      <div className="space-y-6">
        <ClientsHeader onClientAdded={fetchClients} />
        
        <ClientsTable
          clients={filteredClients}
          loading={loading}
          searchTerm={searchTerm}
          filters={filters}
          countries={countries}
          industries={industries}
          users={users}
          onSearchChange={setSearchTerm}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          onNavigate={(id) => navigate(`/clients/${id}`)}
          onDelete={handleDelete}
        />
      </div>
    </MainLayout>
  );
}