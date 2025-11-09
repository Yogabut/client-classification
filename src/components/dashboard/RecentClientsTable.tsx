import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecentClientsTableRow } from './RecentClientsTableRow';
import { Client } from './useDashboard';

interface RecentClientsTableProps {
  clients: Client[];
  loading: boolean;
}

export const RecentClientsTable = ({ clients, loading }: RecentClientsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Clients</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No clients yet. Add your first client to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Name</th>
                  <th className="text-left p-2 font-medium">Country</th>
                  <th className="text-left p-2 font-medium">Industry</th>
                  <th className="text-left p-2 font-medium">Status</th>
                  <th className="text-left p-2 font-medium">Last Contact</th>
                  <th className="text-left p-2 font-medium">Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <RecentClientsTableRow key={client.id} client={client} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};