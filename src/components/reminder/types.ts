export interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  status: string;
  priority: string;
  client_id: string | null;
  clients?: { name: string } | null;
}

export interface Client {
  id: string;
  name: string;
}

export type TaskFormData = {
  title: string;
  description: string;
  due_date: string;
  priority: string;
  client_id: string | null;
};