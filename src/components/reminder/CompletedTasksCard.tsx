import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { Task } from './types';

interface CompletedTasksCardProps {
  tasks: Task[];
  onDelete: (id: string) => void;
}

export const CompletedTasksCard = ({ tasks, onDelete }: CompletedTasksCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          Completed Tasks ({tasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isCompleted={true}
            onDelete={onDelete}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No completed tasks
          </p>
        )}
      </CardContent>
    </Card>
  );
};