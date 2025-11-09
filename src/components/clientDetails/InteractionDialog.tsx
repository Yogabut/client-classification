// src/components/clientDetails/InteractionDialog.tsx

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Interaction } from './types';

interface InteractionDialogProps {
  isOpen: boolean;
  editingInteraction: Interaction | null;
  onClose: () => void;
  onSubmit: (type: string, note: string) => Promise<void>;
}

export function InteractionDialog({
  isOpen,
  editingInteraction,
  onClose,
  onSubmit,
}: InteractionDialogProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const type = formData.get('type') as string;
    const note = formData.get('note') as string;
    
    await onSubmit(type, note);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingInteraction ? 'Edit Interaction' : 'Log New Interaction'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interaction-type">Interaction Type</Label>
            <Select name="type" defaultValue={editingInteraction?.type} required>
              <SelectTrigger id="interaction-type">
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
            <Label htmlFor="interaction-note">Details</Label>
            <Textarea
              id="interaction-note"
              name="note"
              defaultValue={editingInteraction?.note}
              placeholder="What happened during this interaction?"
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingInteraction ? 'Update' : 'Log Interaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}