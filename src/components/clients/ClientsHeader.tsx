import { AddClientDialog } from '@/components/AddClientDialog';

interface ClientsHeaderProps {
  onClientAdded: () => void;
}

export const ClientsHeader = ({ onClientAdded }: ClientsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-muted-foreground">Manage your client relationships</p>
      </div>
      <AddClientDialog onClientAdded={onClientAdded} />
    </div>
  );
};