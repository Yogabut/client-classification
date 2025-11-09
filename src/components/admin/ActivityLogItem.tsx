import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ActivityLog } from './types';

interface ActivityLogItemProps {
  log: ActivityLog;
}

const getActionBadgeColor = (action: string) => {
  switch (action) {
    case 'created': return 'bg-success/10 text-success';
    case 'updated': return 'bg-primary/10 text-primary';
    case 'deleted': return 'bg-destructive/10 text-destructive';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const ActivityLogItem = ({ log }: ActivityLogItemProps) => {
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{log.profiles?.name || 'Unknown User'}</span>
            <Badge className={`text-xs ${getActionBadgeColor(log.action)}`}>
              {log.action}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {log.entity_type}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {log.profiles?.email || 'No email'}
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
        </span>
      </div>
    </div>
  );
};