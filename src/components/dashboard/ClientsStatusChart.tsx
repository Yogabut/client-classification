import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusData } from './useDashboard';

interface ClientsStatusChartProps {
  statusData: StatusData[];
  loading: boolean;
}

export const ClientsStatusChart = ({ statusData, loading }: ClientsStatusChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients by Status</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Loading chart...
          </div>
        ) : statusData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No client data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};