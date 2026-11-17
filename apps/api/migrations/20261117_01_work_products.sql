-- Migration date: 2026-11-17
-- Draft text is separate from source document files; all revisions are unapproved.
create table if not exists public.work_products (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  current_version_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists work_products_project_updated on public.work_products(project_id,updated_at desc,id);
create table if not exists public.work_product_versions (
  id uuid primary key,
  work_product_id uuid not null references public.work_products(id) on delete cascade,
  revision integer not null check (revision > 0),
  based_on_version_id uuid,
  title text not null check (char_length(title) between 1 and 200),
  body text not null check (char_length(body) between 1 and 100000),
  scope text not null check (char_length(scope) <= 10000),
  assumptions text not null check (char_length(assumptions) <= 10000),
  sources jsonb not null check (jsonb_typeof(sources)='array' and jsonb_array_length(sources)<=50),
  created_by uuid references auth.users(id) on delete set null,
  author_label text not null,
  created_at timestamptz not null default now(),
  unique(work_product_id,revision),
  unique(work_product_id,id)
);
do $$ begin
  if not exists(select 1 from pg_constraint where conrelid='public.work_products'::regclass and conname='work_products_current_version_fkey') then
    alter table public.work_products add constraint work_products_current_version_fkey
      foreign key(id,current_version_id) references public.work_product_versions(work_product_id,id) deferrable initially deferred;
  end if;
end; $$;
alter table public.work_products enable row level security;
alter table public.work_product_versions enable row level security;
revoke all on public.work_products,public.work_product_versions from public,anon,authenticated,service_role;
grant select on public.work_products,public.work_product_versions to service_role;

create or replace function public.resolve_work_product_sources(p_project_id uuid,p_actor_id uuid,p_actor_email text,p_sources jsonb)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare
  p public.projects%rowtype;
  item jsonb;
  source record;
  result jsonb := '[]'::jsonb;
begin
  select * into p from public.projects where id=p_project_id;
  if not found or public.project_access_role(p.id,p.user_id,p.org_id,p_actor_id::text,p_actor_email) is null then
    raise exception 'work_product_matter_denied' using errcode='P0002';
  end if;
  if jsonb_typeof(p_sources) is distinct from 'array' or jsonb_array_length(p_sources)>50 then
    raise exception 'work_product_invalid_sources' using errcode='22023';
  end if;
  for item in select value from jsonb_array_elements(p_sources) loop
    select v.filename,v.version_number,v.content_sha256 into source
    from public.document_versions v join public.documents d on d.id=v.document_id
    where d.id=(item->>'document_id')::uuid and v.id=(item->>'version_id')::uuid
      and d.project_id=p_project_id and d.archived_at is null and v.deleted_at is null
      and v.storage_path is not null and v.content_sha256=item->>'content_sha256'
      and v.content_sha256 ~ '^[a-f0-9]{64}$'
      and public.document_text_access(d.id,p_actor_id::text,p_actor_email)
    for share of d,v;
    if not found then raise exception 'work_product_evidence_stale' using errcode='P0001'; end if;
    result := result || jsonb_build_array(jsonb_build_object(
      'document_id',item->>'document_id','version_id',item->>'version_id',
      'content_sha256',source.content_sha256,'filename',coalesce(source.filename,'Source document'),
      'version_number',source.version_number,'locator',coalesce(item->>'locator','')));
  end loop;
  return result;
end; $$;

create or replace function public.save_work_product_version(
  p_project_id uuid,p_work_product_id uuid,p_actor_id uuid,p_actor_email text,p_payload jsonb
) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare
  project public.projects%rowtype;
  product public.work_products%rowtype;
  version public.work_product_versions%rowtype;
  sources jsonb;
  request_id uuid := (p_payload->>'request_id')::uuid;
  expected uuid := (p_payload->>'expected_version_id')::uuid;
  next_revision integer;
  author text;
begin
  select * into project from public.projects where id=p_project_id for share;
  if not found or public.project_access_role(project.id,project.user_id,project.org_id,p_actor_id::text,p_actor_email) is null then
    raise exception 'work_product_matter_denied' using errcode='P0002';
  end if;
  if public.project_access_role(project.id,project.user_id,project.org_id,p_actor_id::text,p_actor_email) not in ('owner','editor') then
    raise exception 'work_product_edit_denied' using errcode='42501';
  end if;
  if request_id is null then raise exception 'work_product_invalid_request' using errcode='22023'; end if;
  perform pg_advisory_xact_lock(hashtextextended(request_id::text,17));
  sources := public.resolve_work_product_sources(p_project_id,p_actor_id,p_actor_email,p_payload->'sources');
  select * into version from public.work_product_versions where id=request_id;
  if found then
    select * into product from public.work_products where id=version.work_product_id for update;
    if product.project_id<>p_project_id or (p_work_product_id is not null and product.id<>p_work_product_id) then
      raise exception 'work_product_not_found' using errcode='P0002';
    end if;
    if version.based_on_version_id is distinct from expected or version.title is distinct from p_payload->>'title' or version.body is distinct from p_payload->>'body'
      or version.scope is distinct from p_payload->>'scope' or version.assumptions is distinct from p_payload->>'assumptions'
      or version.sources is distinct from sources or version.created_by is distinct from p_actor_id then
      raise exception 'work_product_request_conflict' using errcode='P0001';
    end if;
    return jsonb_build_object('work_product',to_jsonb(product),'version',to_jsonb(version),'idempotent',true);
  end if;
  if p_work_product_id is null then
    if expected is not null then raise exception 'work_product_version_conflict' using errcode='P0001'; end if;
    insert into public.work_products(project_id,title) values(p_project_id,p_payload->>'title') returning * into product;
    next_revision := 1;
  else
    select * into product from public.work_products where id=p_work_product_id and project_id=p_project_id for update;
    if not found then raise exception 'work_product_not_found' using errcode='P0002'; end if;
    if product.current_version_id is distinct from expected then raise exception 'work_product_version_conflict' using errcode='P0001'; end if;
    select coalesce(max(revision),0)+1 into next_revision from public.work_product_versions where work_product_id=product.id;
  end if;
  select coalesce(nullif(left(display_name,200),''),'NorthWrit member') into author from public.user_profiles where user_id=p_actor_id;
  insert into public.work_product_versions(id,work_product_id,revision,based_on_version_id,title,body,scope,assumptions,sources,created_by,author_label)
  values(request_id,product.id,next_revision,expected,p_payload->>'title',p_payload->>'body',p_payload->>'scope',p_payload->>'assumptions',sources,p_actor_id,coalesce(author,'NorthWrit member')) returning * into version;
  update public.work_products set current_version_id=version.id,title=version.title,updated_at=now() where id=product.id returning * into product;
  return jsonb_build_object('work_product',to_jsonb(product),'version',to_jsonb(version),'idempotent',false);
end; $$;
revoke all on function public.resolve_work_product_sources(uuid,uuid,text,jsonb),public.save_work_product_version(uuid,uuid,uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.resolve_work_product_sources(uuid,uuid,text,jsonb),public.save_work_product_version(uuid,uuid,uuid,text,jsonb) to service_role;
