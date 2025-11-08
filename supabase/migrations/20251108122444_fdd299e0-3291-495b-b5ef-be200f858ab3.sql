-- Drop the existing trigger function
DROP FUNCTION IF EXISTS public.log_activity() CASCADE;

-- Recreate the function with proper handling for different tables
CREATE OR REPLACE FUNCTION public.log_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_user_id uuid;
BEGIN
  -- Determine the user_id based on the table
  IF TG_OP = 'INSERT' THEN
    -- For clients table, use assigned_user_id; for others, use user_id
    IF TG_TABLE_NAME = 'clients' THEN
      v_user_id := NEW.assigned_user_id;
    ELSE
      v_user_id := NEW.user_id;
    END IF;
    
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
    VALUES (
      v_user_id,
      'created',
      TG_TABLE_NAME,
      NEW.id,
      to_jsonb(NEW)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    -- For clients table, use assigned_user_id; for others, use user_id
    IF TG_TABLE_NAME = 'clients' THEN
      v_user_id := NEW.assigned_user_id;
    ELSE
      v_user_id := NEW.user_id;
    END IF;
    
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
    VALUES (
      v_user_id,
      'updated',
      TG_TABLE_NAME,
      NEW.id,
      jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
    );
  ELSIF TG_OP = 'DELETE' THEN
    -- For clients table, use assigned_user_id; for others, use user_id
    IF TG_TABLE_NAME = 'clients' THEN
      v_user_id := OLD.assigned_user_id;
    ELSE
      v_user_id := OLD.user_id;
    END IF;
    
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
    VALUES (
      v_user_id,
      'deleted',
      TG_TABLE_NAME,
      OLD.id,
      to_jsonb(OLD)
    );
  END IF;
  RETURN NULL;
END;
$function$;

-- Recreate triggers for all relevant tables
DROP TRIGGER IF EXISTS log_clients_activity ON public.clients;
CREATE TRIGGER log_clients_activity
AFTER INSERT OR UPDATE OR DELETE ON public.clients
FOR EACH ROW EXECUTE FUNCTION public.log_activity();

DROP TRIGGER IF EXISTS log_interactions_activity ON public.interactions;
CREATE TRIGGER log_interactions_activity
AFTER INSERT OR UPDATE OR DELETE ON public.interactions
FOR EACH ROW EXECUTE FUNCTION public.log_activity();

DROP TRIGGER IF EXISTS log_tasks_activity ON public.tasks;
CREATE TRIGGER log_tasks_activity
AFTER INSERT OR UPDATE OR DELETE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.log_activity();

-- Enable realtime for clients table
ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;