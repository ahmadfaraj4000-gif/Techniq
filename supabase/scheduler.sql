-- Run after creating the worker and its NOTIFICATION_WORKER_SECRET. Use the
-- project's public legacy anon JWT for the gateway, not the service-role key.
-- Generate a separate random worker secret once in Vault; copy the same value
-- into the Edge Function secret NOTIFICATION_WORKER_SECRET, store the public
-- anon JWT in Vault as techniq_public_anon_jwt, then remove any
-- temporary query results containing it. Do not put the worker secret here.
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net;
select cron.schedule('techniq-notification-worker','* * * * *', $$
 select net.http_post(
  url := 'https://wxfizlkphvgsmikhsosx.supabase.co/functions/v1/notification-worker',
  headers := jsonb_build_object(
   'Content-Type','application/json',
   'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='techniq_public_anon_jwt'),
   'x-worker-secret',(select decrypted_secret from vault.decrypted_secrets where name='techniq_notification_worker_secret')
  ),
  body := '{}'::jsonb, timeout_milliseconds := 60000
 );
$$);
-- pg_net briefly stores request headers in its queue. Restrict database access.
