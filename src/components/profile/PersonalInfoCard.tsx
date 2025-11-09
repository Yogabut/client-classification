import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from './utils';
import { ProfileFormData } from './types';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
}

interface PersonalInfoCardProps {
  user: User | null;
  onUpdateProfile: (formData: ProfileFormData) => Promise<boolean>;
}

export const PersonalInfoCard = ({ user, onUpdateProfile }: PersonalInfoCardProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const profileData: ProfileFormData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
    };

    await onUpdateProfile(profileData);
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
              <AvatarFallback className="text-2xl">
                {user ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" defaultValue={user?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={user?.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={user?.phone || ''} />
            </div>
          </div>

          <Button type="submit">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  );
};