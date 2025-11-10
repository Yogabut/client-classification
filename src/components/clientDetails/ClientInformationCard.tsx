import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Building, DollarSign, Notebook } from 'lucide-react';
import { Client } from './types';

interface ClientInformationCardProps {
  client: Client;
}

export function ClientInformationCard({ client }: ClientInformationCardProps) {
  return (
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
            <p className="text-sm text-muted-foreground">Revenue</p>
            <p className="font-medium">${client.revenue?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Notebook className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Notes</p>
            <p className="font-medium">{client.notes}</p>
          </div>
        </div>
        
        <div className="pt-4">
          <Badge className={`${
            client.status === 'active' ? 'bg-success' :
            client.status === 'pending' ? 'bg-warning' :
            client.status === 'negotiation' ? 'bg-primary' :
            'bg-muted'
          }`}>{client.status}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}