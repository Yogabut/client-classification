export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  created_at: string;
  profiles?: { name: string; email: string } | null;
}