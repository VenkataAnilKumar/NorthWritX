// Isolated model-free integration verification. Run from the repository root.
// Uses existing local Docker images; never runs stack sweeps, migrations on an
// existing database, image pulls/pushes or configured-model inference.
// Usage: node apps/api/scripts/verify-source-journey.cjs --work-root /dev/shm
// Add --work-products for saved draft/export checks; --schema-baseline <ref>
// exercises the supported incremental migration path on a disposable database.
// --acceptance adds connected Chromium and deterministic queued-revocation checks.
// Docker, Node 22+, existing API workspace dependencies and LibreOffice required.
// The JSON evidence contains outcomes only; credentials remain in private temp files.
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const net = require('node:net');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { execFileSync, spawn } = require('node:child_process');

const args = process.argv.slice(2);
const acceptance = args.includes('--acceptance');
const option = (name, fallback) => { const at = args.indexOf(name); return at < 0 ? fallback : args[at + 1]; };
const repo = path.resolve(option('--repo', process.cwd()));
const cancellation = new AbortController();
for (const signal of ['SIGINT','SIGTERM']) process.once(signal, () => cancellation.abort(new Error('Verification cancelled')));
const run = 'northwrit-source-' + crypto.randomBytes(5).toString('hex');
const apiPort = Number(option('--api-port', '3013'));
const gatewayPort = Number(option('--gateway-port', '55431'));
const webPort = Number(option('--web-port', '3014'));
const authPort = gatewayPort + 1, restPort = gatewayPort + 2;
const workRoot = option('--work-root', os.tmpdir());
const evidenceFile = path.resolve(option('--evidence', '/tmp/northwrit-source-journey-evidence.json'));
const secrets = [];
const secret = () => { const value = crypto.randomBytes(32).toString('hex'); secrets.push(value); return value; };
const clean = text => {
    for (const value of secrets) text = text.split(value).join('[redacted]');
    return text.replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[redacted-jwt]')
        .replace(/(\/download\/(?:signed\/)?)[^\s"'<>]+/g, '$1[redacted-capability]')
        .replace(/((?:cookie|set-cookie|authorization|apikey)["']?\s*:\s*)[^\r\n]+/gi, '$1[redacted]');
};
const command = (cmd, argv, input) => {
    try { return execFileSync(cmd, argv, { input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }); }
    catch (error) { throw new Error(`${cmd} ${argv[0]} failed: ${clean(String(error.stderr || '')).slice(-1800)}`); }
};
const docker = (argv, input) => command('docker', argv, input);
const containers = [];
let work, gateway, api, worker, networkCreated = false;
const evidence = { baseline: command('git', ['-C', repo, 'rev-parse', 'HEAD']).trim(), working_tree_dirty: Boolean(command('git',['-C',repo,'status','--porcelain']).trim()), verified_at: new Date().toISOString(), status: 'running', checks: [], runtime: { database: 'postgres:17-alpine', auth: 'supabase/gotrue:v2.189.0', rest: 'postgrest/postgrest:v14.12', storage: 'isolated filesystem', interface: 'real HTTP API and PostgREST RPC', ai: 'unconfigured; no inference' } };
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(label, fn, timeout = 90000) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) { cancellation.signal.throwIfAborted(); const value = await fn(); if (value) return value; await pause(500); }
    throw new Error(`Timed out: ${label}`);
}
async function free(port) {
    const server = net.createServer();
    await new Promise((resolve, reject) => server.once('error', reject).listen(port, '127.0.0.1', resolve));
    await new Promise(resolve => server.close(resolve));
}
function envFile(name, env) { const file = path.join(work, name); fs.writeFileSync(file, Object.entries(env).map(([k,v]) => `${k}=${v}`).join('\n') + '\n', { mode: 0o600 }); return file; }
function container(name, image, env, extra = []) {
    const full = `${run}-${name}`;
    containers.push(full);
    docker(['run', '-d', '--pull=never', '--name', full, '--network', run, '--label', `northwrit.test_run=${run}`, '--log-driver=none', '--env-file', envFile(name+'.env', env), ...extra, image]);
    return full;
}
function jwt(role, key) {
    const b64 = value => Buffer.from(JSON.stringify(value)).toString('base64url');
    const input = b64({ alg: 'HS256', typ: 'JWT' }) + '.' + b64({ role, iss: 'supabase', iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000)+3600 });
    const token = input + '.' + crypto.createHmac('sha256', key).update(input).digest('base64url'); secrets.push(token); return token;
}
async function request(base, resource, token, body, method = body === undefined ? 'GET' : 'POST', expected = [200,201,202,204]) {
    const response = await fetch(base + resource, { method, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body !== undefined ? { 'Content-Type':'application/json' } : {}) }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.any([cancellation.signal, AbortSignal.timeout(30000)]) });
    const text = await response.text();
    assert(expected.includes(response.status), `${method} ${resource.split('?')[0]} returned ${response.status}: ${clean(text).slice(0,500)}`);
    return text ? JSON.parse(text) : null;
}
async function check(name, fn) { await fn(); evidence.checks.push({ name, status: 'passed' }); console.log('PASS ' + name); }
async function stopWorker() {
    if (!worker || worker.exitCode !== null) return;
    worker.kill('SIGTERM');
    await Promise.race([new Promise(resolve => worker.once('exit', resolve)), pause(20000)]);
    if(worker.exitCode === null) { worker.kill('SIGKILL'); await new Promise(resolve => worker.once('exit',resolve)); }
}
async function cleanup() {
    await stopWorker();
    if (api && api.exitCode === null) { api.kill('SIGTERM'); await Promise.race([new Promise(resolve => api.once('exit', resolve)), pause(5000)]); if(api.exitCode === null) api.kill('SIGKILL'); }
    if (gateway) { gateway.closeAllConnections(); await new Promise(resolve => gateway.close(resolve)); }
    const errors=[];
    for (const name of containers.reverse()) {
        try {
            const label=docker(['inspect','--format','{{ index .Config.Labels "northwrit.test_run" }}',name]).trim();
            if(label!==run) {errors.push('Refused to remove a container without this run label');continue;}
            docker(['rm','-f',name]);
        } catch(error) {
            let exists=true;
            try {exists=Boolean(docker(['ps','-aq','--filter',`name=^/${name}$`]).trim());} catch {}
            if(exists) errors.push(clean(String(error.message)));
        }
    }
    if (networkCreated) { try { docker(['network','rm',run]); } catch(error) { errors.push(clean(String(error.message))); } }
    if (work) await fsp.rm(work,{recursive:true,force:true});
    evidence.cleanup=errors.length?{status:'incomplete',errors}:'only run-owned containers, network and temporary files removed';
    if(errors.length) {evidence.status='failed';process.exitCode=1;}
}
async function main() {
    for(const port of [apiPort,gatewayPort,authPort,restPort,...(acceptance?[webPort]:[])]) assert(Number.isInteger(port)&&port>=1024&&port<=65535,'Use valid unprivileged port numbers');
    const disk=fs.statfsSync(repo);
    assert(disk.bavail*disk.bsize>=2*1024**3,'At least 2 GiB of free disk is required before creating the isolated Docker stack');
    for(const image of ['postgres:17-alpine','supabase/gotrue:v2.189.0','postgrest/postgrest:v14.12']) docker(['image','inspect','--format','{{.Id}}',image]);
    const endpoint=process.env.DOCKER_HOST || JSON.parse(docker(['context','inspect','--format','{{json .Endpoints.docker.Host}}']));
    assert(endpoint.startsWith('unix://'),'Verification requires a local Docker Unix socket');
    for (const port of [apiPort,gatewayPort,authPort,restPort,...(acceptance?[webPort]:[])]) await free(port);
    work = fs.mkdtempSync(path.join(workRoot, run+'-')); fs.chmodSync(work,0o700);
    const dbPassword = secret(), jwtSecret = secret();
    const anon = jwt('anon',jwtSecret), service = jwt('service_role',jwtSecret);
    const gatewayUrl = `http://127.0.0.1:${gatewayPort}`, apiUrl = `http://127.0.0.1:${apiPort}`;
    docker(['network','create','--label',`northwrit.test_run=${run}`,run]); networkCreated=true;
    const db = container('db','postgres:17-alpine',{ POSTGRES_PASSWORD:dbPassword },['--tmpfs','/var/lib/postgresql/data:rw,size=512m']);
    await until('disposable database', () => { try { docker(['exec',db,'pg_isready','-h','127.0.0.1','-U','postgres']); return true; } catch { return false; } });
    const sql = value => docker(['exec','-i',db,'psql','-X','-q','-v','ON_ERROR_STOP=1','-U','postgres'],value);
    sql(`create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
create role authenticator login password '${dbPassword}' noinherit; grant anon,authenticated,service_role to authenticator;
create role supabase_auth_admin login password '${dbPassword}' createrole;
create schema auth authorization supabase_auth_admin;
grant all on database postgres to supabase_auth_admin; grant all on schema public to supabase_auth_admin;
alter role supabase_auth_admin set search_path=auth;`);
    container('auth','supabase/gotrue:v2.189.0',{
        GOTRUE_API_HOST:'0.0.0.0',GOTRUE_API_PORT:'9999',API_EXTERNAL_URL:gatewayUrl,
        GOTRUE_DB_DRIVER:'postgres',GOTRUE_DB_DATABASE_URL:`postgres://supabase_auth_admin:${dbPassword}@${db}:5432/postgres`,
        GOTRUE_SITE_URL:apiUrl,GOTRUE_URI_ALLOW_LIST:apiUrl,GOTRUE_JWT_SECRET:jwtSecret,GOTRUE_JWT_EXP:'3600',
        GOTRUE_JWT_AUD:'authenticated',GOTRUE_JWT_DEFAULT_GROUP_NAME:'authenticated',GOTRUE_JWT_ADMIN_ROLES:'service_role',
        GOTRUE_DISABLE_SIGNUP:'false',GOTRUE_EXTERNAL_EMAIL_ENABLED:'true',GOTRUE_EXTERNAL_PHONE_ENABLED:'false',
        GOTRUE_EXTERNAL_GOOGLE_ENABLED:'false',GOTRUE_MAILER_AUTOCONFIRM:'true',GOTRUE_PASSWORD_MIN_LENGTH:'10',
    },['-p',`127.0.0.1:${authPort}:9999`]);
    await until('disposable Auth migrations',async()=>{try{return (await fetch(`http://127.0.0.1:${authPort}/health`)).ok;}catch{return false;}});
    const baseline=option('--schema-baseline',null);
    if(baseline) {
        sql(command('git',['-C',repo,'show',`${baseline}:apps/api/schema.sql`]));
        const legacyId=crypto.randomUUID();
        sql(`insert into public.projects(id,name,cm_number,practice) values('${legacyId}','Synthetic upgrade fixture','UPGRADE-REF','Legacy vocabulary');`);
        for(const filename of fs.readdirSync(path.join(repo,'apps/api/migrations')).filter(name=>/^\d{8}_.*\.sql$/.test(name)).sort()) {
            const found=docker(['exec',db,'psql','-X','-qAt','-U','postgres','-c',`select exists(select 1 from public.schema_migrations where filename='${filename}')`]).trim();
            if(found==='f') sql('begin;\n'+fs.readFileSync(path.join(repo,'apps/api/migrations',filename),'utf8')+`\ninsert into public.schema_migrations(filename) values('${filename}'); commit;`);
        }
        sql(`do $$ begin if not exists(select 1 from public.projects where id='${legacyId}' and cm_number='UPGRADE-REF' and practice='Legacy vocabulary') then raise exception 'Upgrade changed legacy matter'; end if; end; $$;`);
        evidence.runtime.schema_baseline=baseline;
    } else sql(fs.readFileSync(path.join(repo,'apps/api/schema.sql'),'utf8'));
    container('rest','postgrest/postgrest:v14.12',{
        PGRST_DB_URI:`postgres://authenticator:${dbPassword}@${db}:5432/postgres`,PGRST_DB_SCHEMAS:'public',PGRST_DB_ANON_ROLE:'anon',PGRST_JWT_SECRET:jwtSecret,
    },['-p',`127.0.0.1:${restPort}:3000`]);
    await until('disposable PostgREST',async()=>{try{return (await fetch(`http://127.0.0.1:${restPort}/`)).ok;}catch{return false;}});
    gateway = http.createServer((req,res)=>{
        const auth = req.url.startsWith('/auth/v1/'), rest = req.url.startsWith('/rest/v1/');
        if (!auth&&!rest) {res.writeHead(404).end();return;}
        const upstream=http.request({hostname:'127.0.0.1',port:auth?authPort:restPort,path:req.url.replace(auth?'/auth/v1':'/rest/v1',''),method:req.method,headers:req.headers},reply=>{res.writeHead(reply.statusCode,reply.headers);reply.pipe(res);});
        upstream.on('error',()=>{res.writeHead(502).end();});req.pipe(upstream);
    });
    await new Promise(resolve=>gateway.listen(gatewayPort,'127.0.0.1',resolve));
    const apiEnv={PATH:process.env.PATH,NODE_ENV:'development',DOTENV_CONFIG_PATH:'/dev/null',PORT:String(apiPort),HOST:'127.0.0.1',
        SUPABASE_URL:gatewayUrl,SUPABASE_PUBLISHABLE_KEY:anon,SUPABASE_SECRET_KEY:service,FRONTEND_URL:acceptance?`http://127.0.0.1:${webPort}`:apiUrl,
        STORAGE_DRIVER:'fs',STORAGE_FS_ROOT:path.join(work,'storage'),BACKEND_PUBLIC_URL:apiUrl,API_PUBLIC_URL:apiUrl,
        DOWNLOAD_SIGNING_SECRET:secret(),USER_API_KEYS_ENCRYPTION_SECRET:secret(),AUTH_HANDOFF_ENCRYPTION_SECRET:secret(),
        WORKERS_MODE:acceptance?'none':'inline',SENTRY_DISABLED:'true',TMPDIR:work,UPLOAD_PROCESSING_TEMP_DIR:path.join(work,'processing'),
        TSX_TSCONFIG_PATH:path.join(repo,'apps/api/tsconfig.json')};
    fs.mkdirSync(apiEnv.UPLOAD_PROCESSING_TEMP_DIR,{recursive:true});
    const log=fs.openSync(path.join(work,'api.log'),'a',0o600);
    api=spawn(process.execPath,['--import',path.join(repo,'apps/api/node_modules/tsx/dist/loader.mjs'),path.join(repo,'apps/api/src/index.ts')],{cwd:work,env:apiEnv,stdio:['ignore',log,log]});
    fs.closeSync(log);
    await until('isolated API boot',async()=>{if(api.exitCode!==null)throw new Error('API boot failed: '+clean(fs.readFileSync(path.join(work,'api.log'),'utf8')).slice(-2200));try{return(await fetch(apiUrl+'/health')).ok;}catch{return false;}});
    const startWorker = async () => {
        const workerLog=path.join(work,'worker.log'); const output=fs.openSync(workerLog,'w',0o600);
        worker=spawn(process.execPath,['--import',path.join(repo,'apps/api/node_modules/tsx/dist/loader.mjs'),path.join(repo,'apps/api/src/worker.ts')],{cwd:work,env:apiEnv,stdio:['ignore',output,output]}); fs.closeSync(output);
        await until('standalone worker boot',async()=>{
            if(worker.exitCode!==null) throw new Error('Disposable worker boot failed');
            return fs.readFileSync(workerLog,'utf8').includes('NorthWrit worker process running');
        });
    };
    if(acceptance) await startWorker();
    console.log('Isolated Auth, PostgREST, API, workers and file storage ready');
    const rest = (resource,body,token=service,method) => request(gatewayUrl+'/rest/v1',resource,token,body,method);
    const account = async name => {
        const password=secret(); const email=`${name}@northwrit.local`;
        const user=await request(gatewayUrl+'/auth/v1','/admin/users',service,{email,password,email_confirm:true,user_metadata:{display_name:name}});
        const session=await request(gatewayUrl+'/auth/v1','/token?grant_type=password',anon,{email,password});
        secrets.push(session.access_token,session.refresh_token);
        return {id:user.id,email,password,token:session.access_token};
    };
    const a=await account('synthetic-owner'), b=await account('synthetic-other');
    const call=(who,resource,body,method,expected)=>request(apiUrl,resource,who.token,body,method,expected);
    let orgA,orgB,matterA,matterB,otherMatter,source,pdfSource,version1,version2,bytes1;
    await check('real sign-in, separate organizations and matter metadata',async()=>{
        orgA=await call(a,'/orgs',{name:'Synthetic firm A'});orgB=await call(b,'/orgs',{name:'Synthetic firm B'});
        matterA=await call(a,'/projects',{name:'Synthetic matter A',org_id:orgA.id,memory_enabled:false,client_name:'Synthetic client',jurisdiction:'Ontario',matter_status:'open'});
        matterB=await call(b,'/projects',{name:'Synthetic matter B',org_id:orgB.id,memory_enabled:false});
        assert.equal(matterA.client_name,'Synthetic client');assert.equal(matterA.memory_enabled,false);
        const updated=await call(a,`/projects/${matterA.id}`,{client_name:null,jurisdiction:'Ontario',matter_status:'closed'},'PATCH');
        assert.equal(updated.client_name,null);assert.equal(updated.matter_status,'closed');
        const persisted=await call(a,`/projects/${matterA.id}`);assert.equal(persisted.client_name,null);assert.equal(persisted.matter_status,'closed');
        await call(b,`/projects/${matterA.id}`,{matter_status:'open'},'PATCH',[403,404]);
        otherMatter=await call(a,'/projects',{name:'Other synthetic matter',org_id:orgA.id,memory_enabled:false});
        await call(b,`/projects/${matterA.id}`,undefined,'GET',[404]);
        await call(a,`/projects/${matterB.id}`,undefined,'GET',[404]);
    });
    const {Document,Paragraph,Packer}=require(path.join(repo,'apps/api/node_modules/docx'));
    const docx=async text=>Packer.toBuffer(new Document({sections:[{children:[new Paragraph(text)]}]}));
    async function upload(who,filename,bytes,destination,purpose='document_create',terminal='completed') {
        const session=await call(who,'/upload-sessions',{purpose,destination,files:[{client_id:crypto.randomUUID(),filename,size_bytes:bytes.length}]});
        const file=session.files[0];assert(file.upload&&file.upload.url,'Upload capability missing');
        const put=await fetch(file.upload.url,{method:'PUT',headers:file.upload.headers,body:bytes});assert.equal(put.ok,true,'Direct file PUT failed');
        await call(who,`/upload-sessions/${session.session.id}/files/${file.id}/complete`,{});
        const completed=await until('upload processing '+filename,async()=>{
            const state=await call(who,`/upload-sessions/${session.session.id}`);const next=state.files[0];
            if(next.status==='completed'||next.status==='error'){assert.equal(next.status,terminal,`Unexpected ${filename} result: ${next.error_code}`);return next;}return false;
        },120000);
        return {session,file:completed};
    }
    await check('DOCX staged upload and actual worker processing',async()=>{
        bytes1=await docx('northwritneedle first synthetic source version');
        const uploaded=await upload(a,'Synthetic-Agreement.docx',bytes1,{scope:'project',project_id:matterA.id});
        source=uploaded.file.result;assert(source&&source.id,'Document result missing');
        const versions=await call(a,`/single-documents/${source.id}/versions`);version1=versions.current_version_id;assert(version1);
        evidence.processing={docx:'completed'};
    });
    await check('download admission, DOCX bytes and cross-organization denial',async()=>{
        await call(b,`/single-documents/${source.id}`,undefined,'GET',[403,404]);
        await call(b,`/single-documents/${source.id}/url`,undefined,'GET',[404]);
        const link=await call(a,`/single-documents/${source.id}/url?version_id=${version1}`);
        const response=await fetch(link.url);assert(response.ok);assert.deepEqual(Buffer.from(await response.arrayBuffer()),bytes1);
        await call(b,'/upload-sessions',{purpose:'document_create',destination:{scope:'project',project_id:matterA.id},files:[{client_id:'denied',filename:'Denied.docx',size_bytes:bytes1.length}]},'POST',[404,403]);
    });
    await check('new document version preserves original version bytes',async()=>{
        const bytes2=await docx('northwritneedle second synthetic source version');
        await upload(a,'Synthetic-Agreement.docx',bytes2,{document_id:source.id},'document_version_create');
        const versions=await call(a,`/single-documents/${source.id}/versions`);version2=versions.current_version_id;assert.notEqual(versions.current_version_id,version1);assert.equal(versions.versions.length,2);
        for(const [id,bytes]of[[version1,bytes1],[versions.current_version_id,bytes2]]){
            const link=await call(a,`/single-documents/${source.id}/url?version_id=${id}`);const response=await fetch(link.url);assert(response.ok);assert.deepEqual(Buffer.from(await response.arrayBuffer()),bytes);
        }
    });
    await check('valid PDF processing and same-organization matter binding',async()=>{
        const stream='BT /F1 12 Tf 72 720 Td (crossmatterpdfmarker synthetic PDF source) Tj ET';
        const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
            '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`];
        let pdf='%PDF-1.4\n'; const offsets=[0];
        for(let i=0;i<objects.length;i++){offsets.push(Buffer.byteLength(pdf));pdf+=`${i+1} 0 obj\n${objects[i]}\nendobj\n`;}
        const xref=Buffer.byteLength(pdf);pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
        for(const offset of offsets.slice(1))pdf+=String(offset).padStart(10,'0')+' 00000 n \n';
        pdf+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
        const bytes=Buffer.from(pdf);
        const uploaded=await upload(a,'Synthetic-Source.pdf',bytes,{scope:'project',project_id:otherMatter.id});pdfSource=uploaded.file.result;
        assert(pdfSource.id);evidence.processing.pdf='completed';
        await call(a,`/projects/${matterA.id}/documents/${pdfSource.id}`,{filename:'Wrong-matter.pdf'},'PATCH',[403,404]);
        const document=await call(a,`/single-documents/${pdfSource.id}`);assert.equal(document.filename,'Synthetic-Source.pdf');
        const link=await call(a,`/single-documents/${pdfSource.id}/url`);const response=await fetch(link.url);assert(response.ok);assert.deepEqual(Buffer.from(await response.arrayBuffer()),bytes);
    });
    await check('real indexed source-text search and denied actor visibility',async()=>{
        const params={p_user_id:a.id,p_user_email:a.email,p_workspace:orgA.id,p_scope:'project',p_query:'northwritneedle',p_project_id:matterA.id,p_document_id:null,p_version_id:null,p_limit:10,p_offset:0};
        const found=await until('source-text index',async()=>{const result=await rest('/rpc/find_document_text',params);return result.matches?.some(item=>item.document_id===source.id)?result:false;},90000);
        assert(found.matches.every(item=>item.document_id===source.id&&item.version_id===version2));
        const historical=await rest('/rpc/find_document_text',{...params,p_scope:'document',p_document_id:source.id,p_version_id:version1});
        assert(historical.matches.some(item=>item.version_id===version1));
        const other=await rest('/rpc/find_document_text',{...params,p_query:'crossmatterpdfmarker'});assert.equal(other.matches.length,0);
        const denied=await rest('/rpc/find_document_text',{...params,p_user_id:b.id,p_user_email:b.email});assert.equal(denied.matches.length,0);
        await request(gatewayUrl+'/rest/v1','/rpc/find_document_text',a.token,params,'POST',[401,403,404]);
    });
    await check('invalid PDF remains an explicit failed upload',async()=>{
        const invalid=await upload(a,'Invalid.pdf',Buffer.from('synthetic invalid PDF bytes'),{scope:'project',project_id:matterA.id},'document_create','error');
        assert.equal(invalid.file.error_code,'invalid_pdf_file');assert.equal(invalid.file.result,null);
    });
    await check('model catalogue has no configured inference model',async()=>{
        const models=await call(a,'/models/configured');assert.equal(Array.isArray(models)?models.length:models.models.length,0);
    });
    if(args.includes('--work-products') || acceptance) {
        let draft, firstVersion, secondDraftVersion, currentDraftVersion, initial;
        const base=`/projects/${matterA.id}/work-products`;
        const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
        await check('saved draft provenance, idempotency, conflicts and restoration',async()=>{
            initial={request_id:crypto.randomUUID(),expected_version_id:null,title:'Synthetic work product',body:'Original draft <text> & analysis',scope:'Synthetic contract scope',assumptions:'No legal advice; synthetic data',sources:[{document_id:source.id,version_id:version1,content_sha256:hash(bytes1),locator:'Opening paragraph'}]};
            draft=await call(a,base,initial);firstVersion=draft.version.id;
            assert.equal(draft.version.revision,1);assert.equal(draft.version.created_by,a.id);assert.equal(draft.version.sources[0].filename,'Synthetic-Agreement.docx');
            const duplicate=await call(a,base,initial);assert.equal(duplicate.work_product.id,draft.work_product.id);assert.equal(duplicate.idempotent,true);
            const response=await fetch((await call(a,`/single-documents/${source.id}/url?version_id=${version2}`)).url);const currentBytes=Buffer.from(await response.arrayBuffer());
            const update={...initial,request_id:crypto.randomUUID(),expected_version_id:firstVersion,body:'Updated draft',sources:[{document_id:source.id,version_id:version2,content_sha256:hash(currentBytes),locator:'Current opening'}]};
            const revised=await call(a,`${base}/${draft.work_product.id}/versions`,update);secondDraftVersion=revised.version.id;assert.equal(revised.version.revision,2);assert.equal(revised.version.based_on_version_id,firstVersion);
            await call(a,`${base}/${draft.work_product.id}/versions`,{...update,request_id:crypto.randomUUID()},'POST',[409]);
            const retry=await call(a,base,initial);assert.equal(retry.version.id,firstVersion);assert.equal(retry.work_product.current_version_id,secondDraftVersion);
            const history=await call(a,`${base}/${draft.work_product.id}/versions`);assert.equal(history.versions.length,2);assert.deepEqual(history.versions.map(v=>v.revision),[2,1]);
            const old=await call(a,`${base}/${draft.work_product.id}/versions/${firstVersion}`);assert.equal(old.version.body,initial.body);assert.equal(old.version.sources[0].version_id,version1);
            const restored=await call(a,`${base}/${draft.work_product.id}/versions`,{...initial,request_id:crypto.randomUUID(),expected_version_id:secondDraftVersion});currentDraftVersion=restored.version.id;assert.equal(restored.version.revision,3);assert.equal(restored.version.body,initial.body);assert.equal(restored.version.based_on_version_id,secondDraftVersion);
            const unchanged=await call(a,`${base}/${draft.work_product.id}/versions/${secondDraftVersion}`);assert.equal(unchanged.version.body,'Updated draft');
            await call(b,base,undefined,'GET',[404]);
            await call(b,base,initial,'POST',[404]);
            await call(a,`/projects/not-a-uuid/work-products`,undefined,'GET',[400]);
            const pdf=await call(a,`/single-documents/${pdfSource.id}`);
            await call(a,base,{...initial,request_id:crypto.randomUUID(),sources:[{document_id:pdf.id,version_id:pdf.current_version_id,content_sha256:pdf.content_sha256}]},'POST',[409]);
        });
        const exported = async (who,project,id,version,expected=200) => {
            const response=await fetch(apiUrl+`/projects/${project}/work-products/${id}/versions/${version}/export`,{method:'POST',headers:{Authorization:`Bearer ${who.token}`}});
            assert.equal(response.status,expected,'Draft export status');return response;
        };
        await check('selected draft DOCX export includes scope, assumptions and exact source version',async()=>{
            const response=await exported(a,matterA.id,draft.work_product.id,firstVersion);assert(response.headers.get('content-disposition').includes('draft'));assert.equal(response.headers.get('cache-control'),'private, no-store');
            const JSZip=require(path.join(repo,'apps/api/node_modules/jszip'));const zip=await JSZip.loadAsync(Buffer.from(await response.arrayBuffer()));const xml=await zip.file('word/document.xml').async('string');
            for(const marker of ['DRAFT — NOT APPROVED','Synthetic contract scope','No legal advice',version1,firstVersion,'Original draft &lt;text&gt; &amp; analysis'])assert(xml.includes(marker),`DOCX missing ${marker}`);
            assert.equal((await exported(b,matterA.id,draft.work_product.id,firstVersion,404)).status,404);
        });
        await check('changed evidence blocks historical export without rewriting saved history',async()=>{
            await upload(a,'Synthetic-Agreement.docx',await docx('Replacement bytes for old source version'),{document_id:source.id,version_id:version1,expected_content_sha256:hash(bytes1),generate_pdf:false},'document_version_replace');
            const old=await call(a,`${base}/${draft.work_product.id}/versions/${firstVersion}`);assert.equal(old.evidence_status,'changed_or_unavailable');assert.equal(old.version.body,initial.body);
            await exported(a,matterA.id,draft.work_product.id,firstVersion,409);
            await exported(a,matterA.id,draft.work_product.id,secondDraftVersion);
            await call(a,`${base}/${draft.work_product.id}/versions`,{...initial,request_id:crypto.randomUUID(),expected_version_id:currentDraftVersion},'POST',[409]);
        });
        await check('viewer can read/export drafts but cannot save, and revocation stops access',async()=>{
            const personal=await call(a,'/projects',{name:'Synthetic shared draft matter',memory_enabled:false});
            await call(a,`/projects/${personal.id}/access`,{email:b.email,role:'viewer'});
            const item=await call(a,`/projects/${personal.id}/work-products`,{...initial,request_id:crypto.randomUUID(),sources:[]});
            await call(b,`/projects/${personal.id}/work-products/${item.work_product.id}`);
            await exported(b,personal.id,item.work_product.id,item.version.id);
            await call(b,`/projects/${personal.id}/work-products`,{...initial,request_id:crypto.randomUUID(),sources:[]},'POST',[403]);
            await call(b,`/projects/${personal.id}/work-products/${item.work_product.id}/versions`,{...initial,request_id:crypto.randomUUID(),expected_version_id:item.version.id,sources:[]},'POST',[403]);
            await call(a,`/projects/${personal.id}/access/${encodeURIComponent(b.email)}`,undefined,'DELETE');
            await call(b,`/projects/${personal.id}/work-products/${item.work_product.id}`,undefined,'GET',[404]);
            await exported(b,personal.id,item.work_product.id,item.version.id,404);
            await call(a,`/projects/${personal.id}`,undefined,'DELETE');
            const removed=await rest(`/work_product_versions?work_product_id=eq.${item.work_product.id}`);assert.equal(removed.length,0);
        });
        await check('draft tables are backend-only and revisions cannot be directly rewritten',async()=>{
            sql(`do $$ begin
              if has_table_privilege('service_role','public.work_product_versions','UPDATE') or has_table_privilege('authenticated','public.work_product_versions','SELECT') or has_function_privilege('authenticated','public.save_work_product_version(uuid,uuid,uuid,text,jsonb)','EXECUTE') then raise exception 'Unsafe work product privileges'; end if;
              if not (select relrowsecurity from pg_class where oid='public.work_product_versions'::regclass) then raise exception 'Work product RLS disabled'; end if;
              end; $$;`);
            await rest(`/work_product_versions?id=eq.${firstVersion}`,{body:'Forbidden rewrite'},service,'PATCH').then(()=>assert.fail('Direct version mutation succeeded'),error=>assert(String(error.message).includes('403')));
            sql(fs.readFileSync(path.join(repo,'apps/api/migrations/20261117_01_work_products.sql'),'utf8'));
            const preserved=await call(a,`${base}/${draft.work_product.id}/versions/${firstVersion}`);assert.equal(preserved.version.body,initial.body);
        });
    }
    if(acceptance) {
        await check('queued upload rechecks a revoked editor before publishing any result',async()=>{
            const project=await call(a,'/projects',{name:'Synthetic queued access check',memory_enabled:false});
            await call(a,`/projects/${project.id}/access`,{email:b.email,role:'editor'});
            await stopWorker();
            const bytes=await docx('Never publish this revoked queued source');
            const session=await call(b,'/upload-sessions',{purpose:'document_create',destination:{scope:'project',project_id:project.id},files:[{client_id:crypto.randomUUID(),filename:'Revoked-Queued.docx',size_bytes:bytes.length}]});
            const file=session.files[0]; const put=await fetch(file.upload.url,{method:'PUT',headers:file.upload.headers,body:bytes}); assert(put.ok);
            await call(b,`/upload-sessions/${session.session.id}/files/${file.id}/complete`,{});
            const jobs=await rest(`/upload_processing_jobs?file_id=eq.${file.id}`);
            assert.equal(jobs.length,1); assert.equal(jobs[0].status,'queued');
            await call(a,`/projects/${project.id}/access/${encodeURIComponent(b.email)}`,undefined,'DELETE');
            await startWorker();
            const ended=await until('revoked queued upload terminal result',async()=>{
                const state=await call(b,`/upload-sessions/${session.session.id}`); const next=state.files[0];
                return ['completed','error'].includes(next.status)?next:false;
            },120000);
            assert.equal(ended.status,'error'); assert.equal(ended.error_code,'upload_access_revoked'); assert.equal(ended.result,null);
            const visible=await call(a,`/projects/${project.id}`); assert.equal(visible.documents.length,0);
            const persisted=await rest(`/documents?project_id=eq.${project.id}`); assert.equal(persisted.length,0);
            evidence.queued_revocation={terminal_status:ended.status,error_code:ended.error_code,result_published:false};
        });
        await check('database publication guards deny revoked and downgraded actors during version and result writes',async()=>{
            await stopWorker();
            assert.equal(await rest('/rpc/document_lifecycle_version',{}),3);
            for(const role of ['viewer','revoked']) {
                const project=await call(a,'/projects',{name:'Synthetic publication boundary '+role,memory_enabled:false});
                await call(a,`/projects/${project.id}/access`,{email:b.email,role:'editor'});
                const manifest={purpose:'document_create',destination:{scope:'project',project_id:project.id},files:[{client_id:crypto.randomUUID(),filename:'Boundary.pdf',size_bytes:100}]};
                const initial=await call(b,'/upload-sessions',manifest); const file=initial.files[0];
                await rest(`/upload_session_files?id=eq.${file.id}`,{status:'processing'},service,'PATCH');
                await rest('/documents',{id:file.resource_id,user_id:b.id,project_id:project.id,status:'processing'});
                const metadata={id:file.id,filename:'Boundary.pdf',storage_path:'synthetic/previous-source.pdf',file_type:'pdf',content_sha256:'a'.repeat(64),source:'upload',version_number:1};
                await rest('/rpc/create_document_version',{p_document_id:file.resource_id,p_version:metadata,p_activate:true});
                const pending=[];
                for(const purpose of ['document_version_create','document_version_replace']) {
                    const request=await call(b,'/upload-sessions',{...manifest,purpose,destination:{document_id:file.resource_id,...(purpose==='document_version_replace'?{version_id:file.id,expected_content_sha256:'a'.repeat(64)}:{})}});
                    pending.push(request.files[0]);
                    await rest(`/upload_session_files?id=eq.${request.files[0].id}`,{status:'processing'},service,'PATCH');
                }
                if(role==='viewer') await call(a,`/projects/${project.id}/access`,{email:b.email,role:'viewer'});
                else await call(a,`/projects/${project.id}/access/${encodeURIComponent(b.email)}`,undefined,'DELETE');
                const [addition,replacement]=pending;
                await request(gatewayUrl+'/rest/v1','/rpc/create_document_version',service,{p_document_id:file.resource_id,p_version:{...metadata,id:addition.resource_id,version_number:2},p_activate:true},'POST',[403]);
                await request(gatewayUrl+'/rest/v1',`/document_versions?id=eq.${file.id}`,service,{storage_path:`documents/${b.id}/${file.resource_id}/versions/${replacement.resource_id.replace(/-/g,'')}.pdf`,content_sha256:'b'.repeat(64)},'PATCH',[403]);
                await request(gatewayUrl+'/rest/v1',`/documents?id=eq.${file.resource_id}`,service,{status:'ready'},'PATCH',[403]);
                await request(gatewayUrl+'/rest/v1',`/upload_session_files?id=eq.${file.id}`,service,{status:'completed',result:{id:file.resource_id}},'PATCH',[403]);
                const persisted=await rest(`/document_versions?document_id=eq.${file.resource_id}`);
                assert.equal(persisted.length,1); assert.equal(persisted[0].content_sha256,'a'.repeat(64));
                assert.equal(persisted[0].storage_path,'synthetic/previous-source.pdf');
                await call(a,`/projects/${project.id}`,undefined,'DELETE');
            }
            await startWorker();
        });
        sql('begin;\n'+fs.readFileSync(path.join(repo,'apps/api/migrations/20261117_02_upload_publication_access.sql'),'utf8')+'\ncommit;');
        const connected=await call(a,'/projects',{name:'Connected acceptance matter',memory_enabled:false});
        await call(a,`/projects/${connected.id}/access`,{email:b.email,role:'viewer'});
        await call(a,'/user/onboarding',{}); await call(b,'/user/onboarding',{});
        const sourceFile=path.join(work,'Connected-Source.docx'); fs.writeFileSync(sourceFile,await docx('connectedjourneyneedle synthetic contract source. Governing law is Ontario.'));
        await check('connected Chromium owner/viewer source draft history DOCX and revocation journey',async()=>{
            const { runConnectedMatter }=require(path.join(repo,'tests/browser/run-isolated-matter.cjs'));
            await runConnectedMatter({repo,work,webPort,apiUrl,until,signal:cancellation.signal,fixture:{
                matterId:connected.id,foreignMatterId:matterB.id,foreignSourceId:pdfSource.id,sourceFile,
                owner:{email:a.email,password:a.password},viewer:{email:b.email,password:b.password},
            }});
        });
        await check('revoked actor is excluded from indexed source search',async()=>{
            const params={p_user_id:a.id,p_user_email:a.email,p_workspace:'personal',p_scope:'project',p_query:'connectedjourneyneedle',p_project_id:connected.id,p_document_id:null,p_version_id:null,p_limit:10,p_offset:0};
            await until('connected source text positive control',async()=>{
                const found=await rest('/rpc/find_document_text',params); return found.matches.length>0;
            });
            const result=await rest('/rpc/find_document_text',{...params,p_user_id:b.id,p_user_email:b.email});
            assert.equal(result.matches.length,0);
        });
        evidence.runtime.browser='Chromium connected through candidate Next.js gateway; no mocked API responses';
        evidence.runtime.workers='separate disposable worker, paused only for deterministic queued revocation';
        evidence.download_limit='New source URLs recheck the issuing account and exact source identity at redemption; original links are denied after revocation. Legacy object-store URLs retain their original expiry.';
    }
    evidence.status='passed';
}
main().catch(error=>{evidence.status='failed';evidence.error=clean(String(error.message));console.error(evidence.error);process.exitCode=1;}).finally(async()=>{
    await cleanup();
    fs.writeFileSync(evidenceFile,JSON.stringify(evidence,null,2)+'\n',{mode:0o600});
    console.log('Evidence written; cleanup outcome recorded');
});
