-- Synthetic assertions for verify-matter-metadata.py; no existing app data used.
begin;
do $$
declare
  legacy public.projects%rowtype;
  created public.projects%rowtype;
  before_projects bigint;
  before_memory bigint;
begin
  select * into strict legacy from public.projects where id='20000000-0000-4000-8000-000000000001';
  if legacy.client_name is not null or legacy.jurisdiction is not null or legacy.matter_status is not null
    or legacy.cm_number <> 'REF-1' or legacy.practice <> 'existing vocabulary' then
    raise exception 'Legacy values changed';
  end if;
  if public.project_access_role(legacy.id,legacy.user_id,legacy.org_id,'10000000-0000-4000-8000-000000000002','viewer@northwrit.local') is distinct from 'viewer' then
    raise exception 'Legacy viewer access changed';
  end if;
  if public.project_access_role(legacy.id,legacy.user_id,legacy.org_id,'10000000-0000-4000-8000-000000000002','stranger@northwrit.local') is not null then
    raise exception 'Unexpected direct access';
  end if;
  created := public.create_project_with_memory(legacy.user_id,'New',null,null,null,false,'Client','Ontario','open');
  if created.client_name <> 'Client' or created.jurisdiction <> 'Ontario' or created.matter_status <> 'open' then
    raise exception 'Metadata creation failed';
  end if;
  if not exists(select 1 from public.memory_files where project_id=created.id and enabled=false) then
    raise exception 'Explicit memory opt-out lost';
  end if;
  created := public.create_project_with_memory(legacy.user_id,'Old caller',null,null,null,true);
  if created.client_name is not null or created.matter_status is not null then
    raise exception 'Old RPC compatibility lost';
  end if;
  select count(*) into before_projects from public.projects;
  select count(*) into before_memory from public.memory_files;
  begin
    perform public.create_project_with_memory(legacy.user_id,'Invalid',null,null,null,false,'Client',null,'bad');
    raise exception 'Invalid status was accepted';
  exception when check_violation then null;
  end;
  if (select count(*) from public.projects) <> before_projects or (select count(*) from public.memory_files) <> before_memory then
    raise exception 'Failed creation left partial state';
  end if;
  begin
    update public.projects set client_name=repeat('x',201) where id=legacy.id;
    raise exception 'Oversized client accepted';
  exception when check_violation then null;
  end;
  begin
    update public.projects set jurisdiction=repeat('x',101) where id=legacy.id;
    raise exception 'Oversized jurisdiction accepted';
  exception when check_violation then null;
  end;
  update public.projects set client_name=repeat('😀',200),matter_status='closed' where id=legacy.id;
  if (select archived_at from public.projects where id=legacy.id) is not null then
    raise exception 'Business status archived legacy matter';
  end if;
  update public.projects set client_name=null,jurisdiction=null,matter_status=null where id=legacy.id;
  if has_table_privilege('anon','public.projects','SELECT,INSERT,UPDATE,DELETE')
    or has_table_privilege('authenticated','public.projects','SELECT,INSERT,UPDATE,DELETE') then
    raise exception 'Backend-only project privileges expanded';
  end if;
  if has_function_privilege('anon','public.create_project_with_memory(uuid,text,text,text,uuid,boolean,text,text,text)','EXECUTE')
    or has_function_privilege('authenticated','public.create_project_with_memory(uuid,text,text,text,uuid,boolean,text,text,text)','EXECUTE')
    or not has_function_privilege('service_role','public.create_project_with_memory(uuid,text,text,text,uuid,boolean,text,text,text)','EXECUTE') then
    raise exception 'Unsafe metadata RPC privileges';
  end if;
end;
$$;
-- Exercise real database role admission as well as inspecting grants.
do $$
begin
  begin
    set local role authenticated;
    perform client_name from public.projects;
    raise exception 'Authenticated direct read unexpectedly succeeded';
  exception when insufficient_privilege then null;
  end;
  begin
    set local role anon;
    perform public.create_project_with_memory(null,'Denied',null,null,null,false,null,null,null);
    raise exception 'Anonymous RPC unexpectedly succeeded';
  exception when insufficient_privilege then null;
  end;
end;
$$;
rollback;
