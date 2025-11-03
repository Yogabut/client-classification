import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, MapPin, Building, DollarSign, Calendar } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ClientDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const client = {
    id,
    name: 'Acme Corp',
    email: 'contact@acme.com',
    phone: '+1 (555) 123-4567',
    country: 'USA',
    industry: 'Technology',
    status: 'Active',
    potentialValue: 50000,
    assignedTo: 'John Doe',
    address: '123 Business St, New York, NY 10001',
  };

  const interactions = [
    { id: 1, date: '2024-01-15', type: 'Email', note: 'Sent proposal for Q1 2024', user: 'John Doe' },
    { id: 2, date: '2024-01-10', type: 'Call', note: 'Discussed project requirements', user: 'John Doe' },
    { id: 3, date: '2024-01-05', type: 'Meeting', note: 'Initial consultation meeting', user: 'Jane Smith' },
  ];

  const attachments = [
    { id: 1, name: 'Proposal_Q1_2024.pdf', size: '2.4 MB', date: '2024-01-15' },
    { id: 2, name: 'Contract_Draft.docx', size: '1.1 MB', date: '2024-01-10' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/clients')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <p className="text-muted-foreground">Client Details</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{client.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p className="font-medium">{client.industry}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Potential Value</p>
                  <p className="font-medium">${client.potentialValue.toLocaleString()}</p>
                </div>
              </div>
              <div className="pt-4">
                <Badge className="bg-success">{client.status}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <Tabs defaultValue="interactions">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="interactions">Interactions</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                </TabsList>
                <TabsContent value="interactions" className="space-y-4">
                  {interactions.map((interaction) => (
                    <div key={interaction.id} className="border-l-2 border-primary pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{interaction.type}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {interaction.date}
                        </span>
                      </div>
                      <p className="font-medium">{interaction.note}</p>
                      <p className="text-sm text-muted-foreground">by {interaction.user}</p>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="attachments" className="space-y-4">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{attachment.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {attachment.size} • {attachment.date}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
