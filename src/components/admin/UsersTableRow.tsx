import { format } from 'date-fns';
import { User } from './types';

interface UsersTableRowProps {
  user: User;
}

export const UsersTableRow = ({ user }: UsersTableRowProps) => {
  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="p-3 font-medium">{user.name}</td>
      <td className="p-3">{user.email}</td>
      <td className="p-3">
        {format(new Date(user.created_at), 'MMM dd, yyyy')}
      </td>
    </tr>
  );
};