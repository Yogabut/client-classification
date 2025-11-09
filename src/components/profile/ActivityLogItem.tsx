import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ActivityLog } from './types';
import { getActionBadgeColor } from './utils';

interface ActivityLogItemProps {
  log: ActivityLog;
}

export const ActivityLogItem = ({ log }: ActivityLogItemProps) => {
  return (
    <div className="border-l-2 border-primary pl-4 py-2">
      <div className="flex items-center gap-2 mb-1">
        <Badge className={`text-xs ${getActionBadgeColor(log.action)}`}>
          {log.action}
        </Badge>
        <span className="text-xs font-medium">{log.entity_type}</span>
      </div>
      <p className="text-xs text-muted-foreground">
        {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
      </p>
    </div>
  );
};