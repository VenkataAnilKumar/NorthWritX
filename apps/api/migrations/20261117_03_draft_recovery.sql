-- Migration date: 2026-11-17
create table if not exists public.work_product_recoveries (
 id uuid primary key,
 project_id uuid not null references public.projects(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 work_product_id uuid references public.work_products(id) on delete cascade,
 base_version_id uuid references public.work_product_versions(id) on delete cascade,
 sequence integer not null default 0 check(sequence>=0),
 fields jsonb,
 discarded_at timestamptz,
 updated_at timestamptz not null default now(),
 expires_at timestamptz not null default now()+interval '24 hours'
);
alter table public.work_product_recoveries enable row level security;
revoke all on public.work_product_recoveries from public,anon,authenticated,service_role;
grant select on public.work_product_recoveries to service_role;
create index if not exists work_product_recovery_owner_idx on public.work_product_recoveries(user_id,project_id,updated_at desc);
create index if not exists work_product_recovery_expiry_idx on public.work_product_recoveries(expires_at);

create or replace function public.write_work_product_recovery(p_id uuid,p_project_id uuid,p_actor_id uuid,p_actor_email text,
 p_sequence integer,p_work_product_id uuid,p_base_version_id uuid,p_fields jsonb,p_discard boolean default false)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare p public.projects%rowtype; r public.work_product_recoveries%rowtype; role_name text;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_project_id::text||p_actor_id::text,1));
 perform pg_advisory_xact_lock(hashtextextended(p_id::text,0));
 select * into p from public.projects where id=p_project_id;
 if not found then raise exception 'recovery_denied' using errcode='P0002'; end if;
 role_name:=public.project_access_role(p.id,p.user_id,p.org_id,p_actor_id::text,p_actor_email);
 if role_name is null then raise exception 'recovery_denied' using errcode='P0002'; end if;
 if role_name not in ('owner','editor') then raise exception 'recovery_editor_required' using errcode='42501'; end if;
 select * into r from public.work_product_recoveries where id=p_id for update;
 if found and (r.user_id<>p_actor_id or r.project_id<>p_project_id) then raise exception 'recovery_denied' using errcode='P0002'; end if;
 if p_discard then
   insert into public.work_product_recoveries(id,project_id,user_id,sequence,fields,discarded_at)
     values(p_id,p_project_id,p_actor_id,0,null,now())
     on conflict(id) do update set fields=null,discarded_at=now(),updated_at=now(),expires_at=now()+interval '24 hours';
   return jsonb_build_object('discarded',true);
 end if;
 if r.discarded_at is not null or (r.id is not null and r.expires_at<=now()) or p_sequence<=coalesce(r.sequence,0) then
   raise exception 'recovery_stale' using errcode='P0001';
 end if;
 if (p_work_product_id is null)<>(p_base_version_id is null) then raise exception 'recovery_binding' using errcode='P0001'; end if;
 if p_work_product_id is not null and not exists(select 1 from public.work_products w join public.work_product_versions v
   on v.work_product_id=w.id where w.id=p_work_product_id and w.project_id=p_project_id and v.id=p_base_version_id) then
   raise exception 'recovery_binding' using errcode='P0001';
 end if;
 if r.id is null and (select count(*) from public.work_product_recoveries where user_id=p_actor_id and project_id=p_project_id and discarded_at is null and expires_at>now())>=50 then
   raise exception 'recovery_limit' using errcode='P0001';
 end if;
 if jsonb_typeof(p_fields) is distinct from 'object' then raise exception 'recovery_fields' using errcode='P0001'; end if;
 insert into public.work_product_recoveries(id,project_id,user_id,work_product_id,base_version_id,sequence,fields)
 values(p_id,p_project_id,p_actor_id,p_work_product_id,p_base_version_id,p_sequence,p_fields)
 on conflict(id) do update set work_product_id=excluded.work_product_id,base_version_id=excluded.base_version_id,
   sequence=excluded.sequence,fields=excluded.fields,updated_at=now(),expires_at=now()+interval '24 hours'
 returning * into r;
 return to_jsonb(r)-'user_id'-'discarded_at';
end; $$;

create or replace function public.prune_work_product_recoveries(p_limit integer default 500)
returns integer language plpgsql security definer set search_path=public,pg_temp as $$
declare removed integer;
begin
 delete from public.work_product_recoveries where expires_at<=now() and id in
   (select id from public.work_product_recoveries where expires_at<=now() order by expires_at limit least(greatest(p_limit,1),500) for update skip locked);
 get diagnostics removed=row_count; return removed;
end; $$;
revoke all on function public.write_work_product_recovery(uuid,uuid,uuid,text,integer,uuid,uuid,jsonb,boolean),public.prune_work_product_recoveries(integer) from public,anon,authenticated;
grant execute on function public.write_work_product_recovery(uuid,uuid,uuid,text,integer,uuid,uuid,jsonb,boolean),public.prune_work_product_recoveries(integer) to service_role;
