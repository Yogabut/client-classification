import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ClientsSearchBar } from './ClientsSearchBar';
import { ClientsTableRow } from './ClientsTableRow';
import { Client } from './useClients';

interface ClientsTableProps {
  clients: Client[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNavigate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ClientsTable = ({
  clients,
  loading,
  searchTerm,
  onSearchChange,
  onNavigate,
  onDelete,
}: ClientsTableProps) => {
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <ClientsSearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading clients...</div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No clients found matching your search.' : 'No clients yet. Add your first client to get started!'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Country</th>
                  <th className="text-left p-3 font-medium">Industry</th>
                  <th className="text-left p-3 font-medium">Revenue</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Assigned To</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <ClientsTableRow
                    key={client.id}
                    client={client}
                    onNavigate={onNavigate}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};