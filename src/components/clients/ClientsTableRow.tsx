import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Client } from './useClients';

interface ClientsTableRowProps {
  client: Client;
  onNavigate: (id: string) => void;
  onDelete: (id: string) => void;
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

export const ClientsTableRow = ({ client, onNavigate, onDelete }: ClientsTableRowProps) => {
  return (
    <tr className="border-b hover:bg-muted/50 transition-colors cursor-pointer">
      <td
        className="p-3 font-medium text-primary"
        onClick={() => onNavigate(client.id)}
      >
        {client.name}
      </td>
      <td className="p-3">{client.email}</td>
      <td className="p-3">{client.country}</td>
      <td className="p-3">{client.industry}</td>
      <td className="p-3 font-semibold text-success">
        ${client.revenue?.toLocaleString() || '0'}
      </td>
      <td className="p-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
          {client.status}
        </span>
      </td>
      <td className="p-3">{client.profiles?.name || 'Unassigned'}</td>
      <td className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onNavigate(client.id)}>
              <Edit className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(client.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};