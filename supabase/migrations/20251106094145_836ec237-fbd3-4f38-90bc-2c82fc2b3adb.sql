-- Create interactions table for client interaction logs
CREATE TABLE IF NOT EXISTS public.interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for interactions
CREATE POLICY "Users can view interactions for clients they can see"
  ON public.interactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = interactions.client_id
    )
  );

CREATE POLICY "Authenticated users can create interactions"
  ON public.interactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions"
  ON public.interactions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions"
  ON public.interactions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_interactions_updated_at
  BEFORE UPDATE ON public.interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add activity logging trigger
CREATE TRIGGER log_interaction_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.log_activity();