import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CountryMap } from '@/components/CountryMap';

export const ClientsCountryCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients by Country</CardTitle>
      </CardHeader>
      <CardContent>
        <CountryMap />
      </CardContent>
    </Card>
  );
};