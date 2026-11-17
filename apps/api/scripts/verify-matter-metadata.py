#!/usr/bin/env python3
"""Verify fresh/upgrade metadata on a disposable database in an explicit PG container.
Does not migrate the container's existing databases or start/stop its services.
Requires existing Supabase anon/authenticated/service_role roles; no credentials logged.
"""
import argparse
from pathlib import Path
import subprocess
import uuid

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--container', required=True)
parser.add_argument('--baseline', required=True, help='Pinned pre-metadata Git revision')
args = parser.parse_args()
root = Path(__file__).resolve().parents[3]
migration_name = '20261116_01_matter_metadata.sql'
migration = (root / 'apps/api/migrations' / migration_name).read_text()
baseline = subprocess.check_output(['git', 'show', f'{args.baseline}:apps/api/schema.sql'], cwd=root, text=True)
assert 'projects_matter_status_check' not in baseline, 'Baseline must predate metadata'
fresh = (root / 'apps/api/schema.sql').read_text()
fixture = (root / 'apps/api/src/__tests__/sql/matter-metadata.sql').read_text()
bootstrap = '''create schema auth;
create table auth.users(id uuid primary key, email text, raw_user_meta_data jsonb default '{}', encrypted_password text);
'''
seed = '''insert into auth.users(id,email) values
('10000000-0000-4000-8000-000000000001','owner@northwrit.local'),
('10000000-0000-4000-8000-000000000002','viewer@northwrit.local');
insert into public.projects(id,user_id,name,cm_number,practice) values
('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','Legacy','REF-1','existing vocabulary');
insert into public.project_access_grants(project_id,email,role) values
('20000000-0000-4000-8000-000000000001','viewer@northwrit.local','viewer');
'''
security_fingerprint = "select relrowsecurity::text || ':' || coalesce(relacl::text,'') from pg_class where oid='public.projects'::regclass;"
fingerprint = '''select column_name || ':' || data_type || ':' || is_nullable
from information_schema.columns where table_schema='public' and table_name='projects' order by ordinal_position;
select conname || ':' || pg_get_constraintdef(oid) from pg_constraint where conrelid='public.projects'::regclass order by conname;
select pg_get_functiondef('public.create_project_with_memory(uuid,text,text,text,uuid,boolean,text,text,text)'::regprocedure);
'''

def command(command, sql=None):
    result = subprocess.run(command, input=sql, text=True, capture_output=True)
    if result.returncode:
        raise RuntimeError(result.stderr[-4000:])
    return result.stdout

results = []
for mode in ('fresh', 'upgrade'):
    database = 'northwrit_metadata_test_' + uuid.uuid4().hex[:12]
    created = False
    try:
        command(['docker', 'exec', args.container, 'createdb', '-U', 'postgres', database])
        created = True
        def run(sql):
            return command(['docker', 'exec', '-i', args.container, 'psql', '-X', '-qAt', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', database], sql)
        run(bootstrap + (fresh if mode == 'fresh' else baseline))
        run(seed)
        original_security = run(security_fingerprint)
        if mode == 'upgrade':
            run('begin;\n' + migration + f"\ninsert into public.schema_migrations(filename) values ('{migration_name}');\ncommit;")
        # Idempotency: re-run the actual migration, without historical replay.
        run('begin;\n' + migration + '\ncommit;')
        assert original_security == run(security_fingerprint), 'Project RLS/ACL state changed'
        run(fixture)
        results.append(run(fingerprint))
        print(f'{mode}: SQL fixtures, grants, creation atomicity and migration rerun passed')
    finally:
        if created:
            command(['docker', 'exec', args.container, 'dropdb', '-U', 'postgres', database])
assert results[0] == results[1], 'Fresh and upgraded project schema/function fingerprints differ'
print('Fresh/upgrade project schema and metadata function fingerprints match. Test databases removed.')
