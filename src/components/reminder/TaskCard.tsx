import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Task } from './types';

interface TaskCardProps {
  task: Task;
  isCompleted?: boolean;
  onMarkDone?: (id: string) => void;
  onDelete: (id: string) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-destructive/10 text-destructive';
    case 'medium': return 'bg-warning/10 text-warning';
    case 'low': return 'bg-primary/10 text-primary';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const TaskCard = ({ task, isCompleted = false, onMarkDone, onDelete }: TaskCardProps) => {
  return (
    <div className={`p-4 border rounded-lg ${isCompleted ? 'bg-muted/30' : 'hover:shadow-md'} transition-shadow`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className={`font-semibold ${isCompleted ? 'line-through opacity-70' : ''}`}>
            {task.title}
          </h3>
          {task.clients && (
            <p className={`text-sm text-primary font-medium ${isCompleted ? 'opacity-70' : ''}`}>
              {task.clients.name}
            </p>
          )}
          {task.description && (
            <p className={`text-sm text-muted-foreground mt-1 ${isCompleted ? 'line-through opacity-70' : ''}`}>
              {task.description}
            </p>
          )}
        </div>
        <div className="flex gap-1">
          {!isCompleted && onMarkDone && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMarkDone(task.id)}
              className="text-success"
            >
              <CheckCircle2 className="h-5 w-5" />
            </Button>
          )}
          {isCompleted && (
            <CheckCircle2 className="h-5 w-5 text-success" />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="text-destructive"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        <Badge variant="outline" className={`text-xs ${isCompleted ? 'opacity-70' : ''}`}>
          {isCompleted ? 'Completed' : 'Due'}: {format(new Date(task.due_date), 'MMM dd, yyyy HH:mm')}
        </Badge>
        {!isCompleted && (
          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </Badge>
        )}
      </div>
    </div>
  );
};