// Isolated model-free integration verification. Run from the repository root.
// Uses existing local Docker images; never runs stack sweeps, migrations on an
// existing database, image pulls/pushes or configured-model inference.
// Usage: node apps/api/scripts/verify-source-journey.cjs --work-root /dev/shm
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
const option = (name, fallback) => { const at = args.indexOf(name); return at < 0 ? fallback : args[at + 1]; };
const repo = path.resolve(option('--repo', process.cwd()));
const cancellation = new AbortController();
for (const signal of ['SIGINT','SIGTERM']) process.once(signal, () => cancellation.abort(new Error('Verification cancelled')));
const run = 'northwrit-source-' + crypto.randomBytes(5).toString('hex');
const apiPort = Number(option('--api-port', '3013'));
const gatewayPort = Number(option('--gateway-port', '55431'));
const authPort = gatewayPort + 1, restPort = gatewayPort + 2;
const workRoot = option('--work-root', os.tmpdir());
const evidenceFile = path.resolve(option('--evidence', '/tmp/northwrit-source-journey-evidence.json'));
const secrets = [];
const secret = () => { const value = crypto.randomBytes(32).toString('hex'); secrets.push(value); return value; };
const clean = text => { for (const value of secrets) text = text.split(value).join('[redacted]'); return text.replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[redacted-jwt]'); };
const command = (cmd, argv, input) => {
    try { return execFileSync(cmd, argv, { input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }); }
    catch (error) { throw new Error(`${cmd} ${argv[0]} failed: ${clean(String(error.stderr || '')).slice(-1800)}`); }
};
const docker = (argv, input) => command('docker', argv, input);
const containers = [];
let work, gateway, api, networkCreated = false;
const evidence = { baseline: command('git', ['-C', repo, 'rev-parse', 'HEAD']).trim(), status: 'running', checks: [], runtime: { database: 'postgres:17-alpine', auth: 'supabase/gotrue:v2.189.0', rest: 'postgrest/postgrest:v14.12', storage: 'isolated filesystem', interface: 'real HTTP API and PostgREST RPC', ai: 'unconfigured; no inference' } };
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
async function cleanup() {
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
    for(const port of [apiPort,gatewayPort,authPort,restPort]) assert(Number.isInteger(port)&&port>=1024&&port<=65535,'Use valid unprivileged port numbers');
    const disk=fs.statfsSync(repo);
    assert(disk.bavail*disk.bsize>=2*1024**3,'At least 2 GiB of free disk is required before creating the isolated Docker stack');
    for(const image of ['postgres:17-alpine','supabase/gotrue:v2.189.0','postgrest/postgrest:v14.12']) docker(['image','inspect','--format','{{.Id}}',image]);
    const endpoint=process.env.DOCKER_HOST || JSON.parse(docker(['context','inspect','--format','{{json .Endpoints.docker.Host}}']));
    assert(endpoint.startsWith('unix://'),'Verification requires a local Docker Unix socket');
    for (const port of [apiPort,gatewayPort,authPort,restPort]) await free(port);
    work = fs.mkdtempSync(path.join(workRoot, run+'-')); fs.chmodSync(work,0o700);
    const dbPassword = secret(), jwtSecret = secret();
    const anon = jwt('anon',jwtSecret), service = jwt('service_role',jwtSecret);
    const gatewayUrl = `http://127.0.0.1:${gatewayPort}`, apiUrl = `http://127.0.0.1:${apiPort}`;
    docker(['network','create','--label',`northwrit.test_run=${run}`,run]); networkCreated=true;
    const db = container('db','postgres:17-alpine',{ POSTGRES_PASSWORD:dbPassword },['--tmpfs','/var/lib/postgresql/data:rw,size=512m']);
    await until('disposable database', () => { try { docker(['exec',db,'pg_isready','-U','postgres']); return true; } catch { return false; } });
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
    sql(fs.readFileSync(path.join(repo,'apps/api/schema.sql'),'utf8'));
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
        SUPABASE_URL:gatewayUrl,SUPABASE_PUBLISHABLE_KEY:anon,SUPABASE_SECRET_KEY:service,FRONTEND_URL:apiUrl,
        STORAGE_DRIVER:'fs',STORAGE_FS_ROOT:path.join(work,'storage'),BACKEND_PUBLIC_URL:apiUrl,API_PUBLIC_URL:apiUrl,
        DOWNLOAD_SIGNING_SECRET:secret(),USER_API_KEYS_ENCRYPTION_SECRET:secret(),AUTH_HANDOFF_ENCRYPTION_SECRET:secret(),
        WORKERS_MODE:'inline',SENTRY_DISABLED:'true',TMPDIR:work,UPLOAD_PROCESSING_TEMP_DIR:path.join(work,'processing'),
        TSX_TSCONFIG_PATH:path.join(repo,'apps/api/tsconfig.json')};
    fs.mkdirSync(apiEnv.UPLOAD_PROCESSING_TEMP_DIR,{recursive:true});
    const log=fs.openSync(path.join(work,'api.log'),'a',0o600);
    api=spawn(process.execPath,['--import',path.join(repo,'apps/api/node_modules/tsx/dist/loader.mjs'),path.join(repo,'apps/api/src/index.ts')],{cwd:work,env:apiEnv,stdio:['ignore',log,log]});
    fs.closeSync(log);
    await until('isolated API boot',async()=>{if(api.exitCode!==null)throw new Error('API boot failed: '+clean(fs.readFileSync(path.join(work,'api.log'),'utf8')).slice(-2200));try{return(await fetch(apiUrl+'/health')).ok;}catch{return false;}});
    console.log('Isolated Auth, PostgREST, API, workers and file storage ready');
    const rest = (resource,body,token=service,method) => request(gatewayUrl+'/rest/v1',resource,token,body,method);
    const account = async name => {
        const password=secret(); const email=`${name}@northwrit.local`;
        const user=await request(gatewayUrl+'/auth/v1','/admin/users',service,{email,password,email_confirm:true,user_metadata:{display_name:name}});
        const session=await request(gatewayUrl+'/auth/v1','/token?grant_type=password',anon,{email,password});
        secrets.push(session.access_token,session.refresh_token);
        return {id:user.id,email,token:session.access_token};
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
    evidence.status='passed';
}
main().catch(error=>{evidence.status='failed';evidence.error=clean(String(error.message));console.error(evidence.error);process.exitCode=1;}).finally(async()=>{
    await cleanup();
    fs.writeFileSync(evidenceFile,JSON.stringify(evidence,null,2)+'\n',{mode:0o600});
    console.log('Evidence written; cleanup outcome recorded');
});
