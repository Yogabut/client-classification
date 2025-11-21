import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityLogItem } from './ActivityLogItem';
import { ActivityLog } from './types';

interface ActivityLogCardProps {
  logs?: ActivityLog[]; 
  loading: boolean;
}

export const ActivityLogCard = ({ logs, loading }: ActivityLogCardProps) => {
  const logList = logs || [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">Loading...</div>
        ) : logList.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No activity yet</div>
        ) : (
          <div className="space-y-3 max-h-[580px] overflow-y-auto">
            {logList.map((log) => (
              <ActivityLogItem key={log.id} log={log} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};