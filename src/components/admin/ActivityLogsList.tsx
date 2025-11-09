import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityLogItem } from './ActivityLogItem';
import { ActivityLog } from './types';

interface ActivityLogsListProps {
  logs: ActivityLog[];
  loading: boolean;
}

export const ActivityLogsList = ({ logs, loading }: ActivityLogsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Activity Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading activity logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No activity logs found</div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <ActivityLogItem key={log.id} log={log} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};