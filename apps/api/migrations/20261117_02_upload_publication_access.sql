-- Migration date: 2026-11-17
-- Recheck the queued session actor at each matter upload publication boundary.
-- Other upload scopes retain their existing authorization contract.
create index if not exists upload_session_files_resource_idx on public.upload_session_files(resource_id);

create or replace function public.assert_upload_matter_access(p_session_id uuid)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
declare
  s public.upload_sessions%rowtype;
  p public.projects%rowtype;
  project_id uuid;
  actor_role text;
begin
  select * into s from public.upload_sessions where id=p_session_id;
  if not found then raise exception 'upload_access_revoked' using errcode='42501'; end if;
  if s.purpose='document_create' and s.destination->>'scope'='project' then
    project_id := (s.destination->>'project_id')::uuid;
  elsif s.purpose in ('document_version_create','document_version_replace') then
    select d.project_id into project_id from public.documents d where d.id=(s.destination->>'document_id')::uuid;
    if not found then raise exception 'upload_access_revoked' using errcode='42501'; end if;
  else return;
  end if;
  if project_id is null then return; end if;
  select * into p from public.projects where id=project_id;
  if not found then raise exception 'upload_access_revoked' using errcode='42501'; end if;
  actor_role := public.project_access_role(p.id,p.user_id,p.org_id,s.user_id::text,s.user_email);
  if actor_role is null or actor_role not in ('owner','editor') then
    raise exception 'upload_access_revoked' using errcode='42501';
  end if;
end; $$;

create or replace function public.guard_upload_matter_publication()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare session_id uuid; slug text;
begin
  if tg_table_name='upload_session_files' then
    if new.status='completed' and old.status is distinct from 'completed' then
      perform public.assert_upload_matter_access(new.session_id);
    end if;
  elsif tg_table_name='documents' then
    if tg_op='INSERT' or (new.status is distinct from old.status and new.status in ('processing','ready'))
      or (new.current_version_id is distinct from old.current_version_id and new.current_version_id is not null) then
      for session_id in select distinct f.session_id from public.upload_session_files f
        where f.status in ('uploaded','processing') and (f.resource_id=new.id or f.resource_id=new.current_version_id)
      loop perform public.assert_upload_matter_access(session_id); end loop;
    end if;
  else
    -- Replacement bytes have a stable per-file resource slug; match only that
    -- upload, so another actor's queued replacement cannot veto unrelated edits.
    slug := substring(new.storage_path from '/versions/([a-f0-9]{32})[.]');
    for session_id in select distinct f.session_id from public.upload_session_files f
      where f.status in ('uploaded','processing') and
        (f.id=new.id or f.resource_id=new.id or f.resource_id=slug::uuid)
    loop perform public.assert_upload_matter_access(session_id); end loop;
  end if;
  return new;
end; $$;

drop trigger if exists documents_upload_matter_guard on public.documents;
create trigger documents_upload_matter_guard before insert or update of status,current_version_id on public.documents
for each row execute function public.guard_upload_matter_publication();
drop trigger if exists versions_upload_matter_guard on public.document_versions;
create trigger versions_upload_matter_guard before insert or update of storage_path,pdf_storage_path,content_sha256 on public.document_versions
for each row execute function public.guard_upload_matter_publication();
drop trigger if exists result_upload_matter_guard on public.upload_session_files;
create trigger result_upload_matter_guard before update of status on public.upload_session_files
for each row execute function public.guard_upload_matter_publication();
revoke all on function public.assert_upload_matter_access(uuid),public.guard_upload_matter_publication() from public,anon,authenticated;
grant execute on function public.assert_upload_matter_access(uuid) to service_role;

-- Keep older builds compatible, but require the barriers for updated workers.
create or replace function public.document_lifecycle_version()
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select case
    -- 20260914_01: the five lifecycle RPCs. Without them every upload,
    -- version and edit fails and deletes orphan their objects.
    when (
      select count(distinct p.proname)
        from pg_catalog.pg_proc p
        join pg_catalog.pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public'
         and p.proname in (
           'create_document_version',
           'create_document_versions',
           'activate_document_version',
           'delete_document_version',
           'queue_document_version_cleanup'
         )
    ) <> 5 then 0
    -- 20260916_01: the upload retry marker. Code that stamps it against a
    -- database without the column fails every new-document upload, so the
    -- guard has to count it as part of the contract.
    when not exists (
      select 1
        from pg_catalog.pg_attribute a
        join pg_catalog.pg_class c on c.oid = a.attrelid
        join pg_catalog.pg_namespace n on n.oid = c.relnamespace
       where n.nspname = 'public'
         and c.relname = 'upload_session_files'
         and a.attname = 'document_created_at'
         and a.attnum > 0
         and not a.attisdropped
    ) then 1
    -- Version 3 requires all current upload publication barriers enabled.
    when (select count(*) from pg_catalog.pg_trigger t
      join pg_catalog.pg_class c on c.oid=t.tgrelid
      join pg_catalog.pg_namespace n on n.oid=c.relnamespace
      where n.nspname='public' and t.tgenabled in ('O','A') and not t.tgisinternal
        and t.tgfoid='public.guard_upload_matter_publication()'::pg_catalog.regprocedure
        and (c.relname,t.tgname) in (
          ('documents','documents_upload_matter_guard'),
          ('document_versions','versions_upload_matter_guard'),
          ('upload_session_files','result_upload_matter_guard'))) <> 3 then 2
    else 3
  end;
$$;
revoke all on function public.document_lifecycle_version()
  from public, anon, authenticated;
grant execute on function public.document_lifecycle_version() to service_role;
