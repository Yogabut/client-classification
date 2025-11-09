export interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  created_at: string;
}

export interface ProfileFormData {
  name: string;
  phone: string;
}