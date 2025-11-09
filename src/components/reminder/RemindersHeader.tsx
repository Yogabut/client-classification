import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddTaskDialog } from './AddTaskDialog';
import { Client, TaskFormData } from './types';

interface RemindersHeaderProps {
  clients: Client[];
  onAddTask: (taskData: TaskFormData) => Promise<boolean>;
}

export const RemindersHeader = ({ clients, onAddTask }: RemindersHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Tasks & Reminders</h1>
        <p className="text-muted-foreground">Stay on top of your client interactions</p>
      </div>
      <AddTaskDialog clients={clients} onAddTask={onAddTask}>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </AddTaskDialog>
    </div>
  );
};