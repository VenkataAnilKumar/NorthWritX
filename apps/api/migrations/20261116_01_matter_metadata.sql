-- Migration date: 2026-11-16
-- Nullable legal metadata; no inferred backfill, lifecycle or access changes.
alter table public.projects
  add column if not exists client_name text,
  add column if not exists jurisdiction text,
  add column if not exists matter_status text;

do $$
begin
  if not exists (select 1 from pg_constraint where conrelid='public.projects'::regclass and conname='projects_client_name_length') then
    alter table public.projects add constraint projects_client_name_length check (char_length(client_name) <= 200);
  end if;
  if not exists (select 1 from pg_constraint where conrelid='public.projects'::regclass and conname='projects_jurisdiction_length') then
    alter table public.projects add constraint projects_jurisdiction_length check (char_length(jurisdiction) <= 100);
  end if;
  if not exists (select 1 from pg_constraint where conrelid='public.projects'::regclass and conname='projects_matter_status_check') then
    alter table public.projects add constraint projects_matter_status_check check (matter_status in ('open', 'on_hold', 'closed'));
  end if;
end;
$$;

-- Keep the six-argument function for older clients. The nine-argument overload
-- creates memory and metadata atomically; constraint failure rolls back both.
create or replace function public.create_project_with_memory(
  p_user_id uuid, p_name text, p_cm_number text, p_practice text,
  p_org_id uuid, p_memory_enabled boolean,
  p_client_name text, p_jurisdiction text, p_matter_status text
)
returns public.projects
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  created public.projects%rowtype;
begin
  created := public.create_project_with_memory(
    p_user_id, p_name, p_cm_number, p_practice, p_org_id, p_memory_enabled
  );
  update public.projects
    set client_name=p_client_name, jurisdiction=p_jurisdiction, matter_status=p_matter_status
    where id=created.id returning * into created;
  return created;
end;
$$;
revoke all on function public.create_project_with_memory(uuid,text,text,text,uuid,boolean,text,text,text) from public, anon, authenticated;
grant execute on function public.create_project_with_memory(uuid,text,text,text,uuid,boolean,text,text,text) to service_role;
