export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string;
  industry: string;
  status: string;
  revenue: number;
  notes: string | null;
}

export interface Interaction {
  id: string;
  type: string;
  note: string;
  created_at: string;
  user_id: string;
  profiles?: { name: string } | null;
}

export interface Attachment {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  description: string | null;
  created_at: string;
  user_id: string;
}