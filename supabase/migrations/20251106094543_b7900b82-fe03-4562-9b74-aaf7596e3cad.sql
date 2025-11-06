-- Create storage bucket for client attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-attachments', 'client-attachments', false);

-- Create attachments table
CREATE TABLE IF NOT EXISTS public.attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for attachments
CREATE POLICY "Users can view attachments for clients they can see"
  ON public.attachments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = attachments.client_id
    )
  );

CREATE POLICY "Authenticated users can upload attachments"
  ON public.attachments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own attachments"
  ON public.attachments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Storage policies for client-attachments bucket
CREATE POLICY "Users can view attachments for clients they can access"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'client-attachments' AND
    EXISTS (
      SELECT 1 FROM public.attachments
      WHERE attachments.file_path = storage.objects.name
    )
  );

CREATE POLICY "Authenticated users can upload attachments"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'client-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own attachments"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'client-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );