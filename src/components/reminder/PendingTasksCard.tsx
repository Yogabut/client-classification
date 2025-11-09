import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { Task } from './types';

interface PendingTasksCardProps {
  tasks: Task[];
  onMarkDone: (id: string) => void;
  onDelete: (id: string) => void;
}

export const PendingTasksCard = ({ tasks, onMarkDone, onDelete }: PendingTasksCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-warning" />
          Pending Tasks ({tasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onMarkDone={onMarkDone}
            onDelete={onDelete}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No pending tasks
          </p>
        )}
      </CardContent>
    </Card>
  );
};