/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Interaction } from './types';

interface InteractionsListProps {
  interactions: Interaction[];
  allInteractions: Interaction[];
  user: any;
  onEdit: (interaction: Interaction) => void;
  onDelete: (id: string) => Promise<boolean>;
}

export function InteractionsList({
  interactions,
  allInteractions,
  user,
  onEdit,
  onDelete,
}: InteractionsListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this interaction?')) return;
    await onDelete(id);
  };

  if (interactions.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        {allInteractions.length === 0 
          ? 'No interactions logged yet' 
          : 'No interactions match your filters'}
      </p>
    );
  }

  return (
    <>
      {interactions.map((interaction) => (
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
                  onClick={() => onEdit(interaction)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDelete(interaction.id)}
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
      ))}
    </>
  );
}