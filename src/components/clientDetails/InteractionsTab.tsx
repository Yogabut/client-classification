/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { InteractionsList } from './InteractionsList';
import { InteractionDialog } from './InteractionDialog';
import { InteractionFilters } from './InteractionFilters';
import { Interaction } from './types';

interface InteractionsTabProps {
  interactions: Interaction[];
  user: any;
  onAddInteraction: (type: string, note: string, userId: string) => Promise<boolean>;
  onUpdateInteraction: (id: string, type: string, note: string) => Promise<boolean>;
  onDeleteInteraction: (id: string) => Promise<boolean>;
}

export function InteractionsTab({
  interactions,
  user,
  onAddInteraction,
  onUpdateInteraction,
  onDeleteInteraction,
}: InteractionsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');

  const filteredInteractions = interactions.filter(interaction => {
    if (filterType !== 'all' && interaction.type !== filterType) return false;
    if (filterDateFrom && new Date(interaction.created_at) < new Date(filterDateFrom)) return false;
    if (filterDateTo && new Date(interaction.created_at) > new Date(filterDateTo)) return false;
    return true;
  });

  const handleOpenDialog = (interaction?: Interaction) => {
    setEditingInteraction(interaction || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingInteraction(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = async (type: string, note: string) => {
    let success = false;
    
    if (editingInteraction) {
      success = await onUpdateInteraction(editingInteraction.id, type, note);
    } else {
      success = await onAddInteraction(type, note, user?.id);
    }
    
    if (success) {
      handleCloseDialog();
    }
  };

  const clearFilters = () => {
    setFilterType('all');
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  return (
    <>
      <InteractionFilters
        filterType={filterType}
        filterDateFrom={filterDateFrom}
        filterDateTo={filterDateTo}
        onFilterTypeChange={setFilterType}
        onFilterDateFromChange={setFilterDateFrom}
        onFilterDateToChange={setFilterDateTo}
        onClearFilters={clearFilters}
        onOpenDialog={() => handleOpenDialog()}
      />
      
      <InteractionsList
        interactions={filteredInteractions}
        allInteractions={interactions}
        user={user}
        onEdit={handleOpenDialog}
        onDelete={onDeleteInteraction}
      />
      
      <InteractionDialog
        isOpen={isDialogOpen}
        editingInteraction={editingInteraction}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
      />
    </>
  );
}