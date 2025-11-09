import { format } from 'date-fns';
import { Client } from './useDashboard';

interface RecentClientsTableRowProps {
  client: Client;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-success/10 text-success';
    case 'pending':
      return 'bg-warning/10 text-warning';
    case 'negotiation':
      return 'bg-primary/10 text-primary';
    case 'inactive':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const RecentClientsTableRow = ({ client }: RecentClientsTableRowProps) => {
  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="p-2 font-medium">{client.name}</td>
      <td className="p-2">{client.country}</td>
      <td className="p-2">{client.industry}</td>
      <td className="p-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
          {client.status}
        </span>
      </td>
      <td className="p-2">
        {client.last_contact ? format(new Date(client.last_contact), 'MMM dd, yyyy') : 'Never'}
      </td>
      <td className="p-2">{client.profiles?.name || 'Unassigned'}</td>
    </tr>
  );
};