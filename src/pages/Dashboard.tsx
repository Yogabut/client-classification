import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, DollarSign, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CountryMap } from '@/components/CountryMap';

const statusData = [
  { name: 'Active', value: 245 },
  { name: 'Lead', value: 128 },
  { name: 'Closed', value: 86 },
  { name: 'Pending', value: 52 },
];


const mockClients = [
  { id: '1', name: 'Acme Corp', country: 'USA', industry: 'Technology', status: 'Active', lastContact: '2024-01-15', assignedTo: 'John Doe', potentialValue: 50000 },
  { id: '2', name: 'Global Industries', country: 'UK', industry: 'Manufacturing', status: 'Lead', lastContact: '2024-01-14', assignedTo: 'Jane Smith', potentialValue: 75000 },
  { id: '3', name: 'Tech Solutions', country: 'Germany', industry: 'Technology', status: 'Active', lastContact: '2024-01-13', assignedTo: 'Mike Johnson', potentialValue: 120000 },
  { id: '4', name: 'Retail Plus', country: 'France', industry: 'Retail', status: 'Pending', lastContact: '2024-01-12', assignedTo: 'Sarah Williams', potentialValue: 30000 },
  { id: '5', name: 'Finance Group', country: 'USA', industry: 'Finance', status: 'Active', lastContact: '2024-01-11', assignedTo: 'Tom Brown', potentialValue: 200000 },
];

export default function Dashboard() {
  const stats = [
    { title: 'Total Clients', value: '511', icon: Users, change: '+12.5%', color: 'text-primary' },
    { title: 'Active Deals', value: '245', icon: Target, change: '+8.2%', color: 'text-success' },
    { title: 'Conversion Rate', value: '68%', icon: TrendingUp, change: '+4.3%', color: 'text-accent' },
    { title: 'Revenue', value: '$1.2M', icon: DollarSign, change: '+18.7%', color: 'text-warning' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your CRM today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-success">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Clients by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clients by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <CountryMap />
            </CardContent>
          </Card>
        </div>

        {/* Recent Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Name</th>
                    <th className="text-left p-2 font-medium">Country</th>
                    <th className="text-left p-2 font-medium">Industry</th>
                    <th className="text-left p-2 font-medium">Status</th>
                    <th className="text-left p-2 font-medium">Last Contact</th>
                    <th className="text-left p-2 font-medium">Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {mockClients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-2 font-medium">{client.name}</td>
                      <td className="p-2">{client.country}</td>
                      <td className="p-2">{client.industry}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          client.status === 'Active' ? 'bg-success/10 text-success' :
                          client.status === 'Lead' ? 'bg-primary/10 text-primary' :
                          client.status === 'Pending' ? 'bg-warning/10 text-warning' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="p-2">{client.lastContact}</td>
                      <td className="p-2">{client.assignedTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
