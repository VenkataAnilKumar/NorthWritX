// Owned, disposable web harness for verify-source-journey.cjs --acceptance.
// No local .env or tracked Next.js config is read by the spawned server.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawn } = require('node:child_process');

async function stop(child) {
    if (!child?.pid) return;
    try { process.kill(-child.pid, 'SIGTERM'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
    if (child.exitCode === null) await Promise.race([new Promise(resolve => child.once('exit', resolve)), new Promise(resolve => setTimeout(resolve, 5000))]);
    try { process.kill(-child.pid, 'SIGKILL'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
}
exports.runConnectedMatter = async function ({ repo, work, webPort, apiUrl, fixture, until, signal, ai = false }) {
    const app = path.join(repo, 'apps/web');
    const shadowRepo = path.join(work, 'candidate');
    const shadow = path.join(shadowRepo, 'apps/web'); fs.mkdirSync(shadow,{recursive:true});
    fs.symlinkSync(path.join(repo,'node_modules'),path.join(shadowRepo,'node_modules'));
    fs.symlinkSync(path.join(repo,'packages'),path.join(shadowRepo,'packages'));
    fs.cpSync(path.join(app,'src'),path.join(shadow,'src'),{recursive:true});
    for (const entry of ['public','node_modules','postcss.config.mjs','sentry.server.config.ts','sentry.edge.config.ts']) fs.symlinkSync(path.join(app,entry),path.join(shadow,entry));
    fs.copyFileSync(path.join(app,'package.json'),path.join(shadow,'package.json'));
    for(const name of ['react','react-dom','@types/react/package.json','typescript']) require.resolve(name,{paths:[shadow]});
    // Keep the candidate's real options. Only config-loader release metadata,
    // tracing root and disk cache are adapted for this disposable source harness.
    let config = fs.readFileSync(path.join(app, 'next.config.ts'), 'utf8');
    config = config.replace('import { releaseName } from "@northwrit/client";', 'const releaseName = () => "northwrit-acceptance";');
    config = config.replace('path.resolve(__dirname, "../..")', JSON.stringify(shadowRepo));
    config = config.replace('webpack: (config) => {', 'webpack: (config) => { config.cache = false;');
    fs.writeFileSync(path.join(shadow, 'next.config.ts'), config);
    const ts = require(path.join(app, 'node_modules/typescript'));
    const parsed = ts.parseConfigFileTextToJson('tsconfig.json', fs.readFileSync(path.join(app, 'tsconfig.json'), 'utf8'));
    if (parsed.error) throw new Error('Cannot parse candidate web TypeScript configuration');
    const settings = parsed.config;
    settings.include = ['next-env.d.ts', 'src/**/*.ts', 'src/**/*.tsx', '.next/dev/types/**/*.ts'];
    fs.writeFileSync(path.join(shadow, 'tsconfig.json'), JSON.stringify(settings));
    fs.copyFileSync(path.join(app, 'tsconfig.build.json'), path.join(shadow, 'tsconfig.build.json'));
    const manifest = path.join(work, 'browser-fixture.json');
    fs.writeFileSync(manifest, JSON.stringify(fixture), { mode: 0o600 });
    const configPath = path.join(work, 'playwright.config.cjs');
    const browserProject = ai ? "isolated-matter-ai" : "isolated-matter";
    const extraProjects = ai
        ? `module.exports.projects = [{ name: "isolated-matter-ai", testMatch: /matter-ai-acceptance\\.spec\\.ts/ }];`
        : "";
    fs.writeFileSync(configPath, `const base=require(${JSON.stringify(path.join(repo,'tests/browser/playwright.config.ts'))}).default; module.exports={...base,testDir:${JSON.stringify(path.join(repo,'tests/browser/e2e'))},webServer:undefined,use:{...base.use,launchOptions:{executablePath:${JSON.stringify(process.env.NORTHWRIT_CHROMIUM_PATH || '/usr/bin/chromium')}}}}; ${extraProjects}`);
    const logFile = path.join(work, 'web.log'), browserLog = path.join(work, 'browser.log');
    // Chromium SingletonSocket paths must fit the Linux Unix-socket limit.
    const browserTmp = fs.mkdtempSync(path.join(os.tmpdir(), "nw-pw-"));
    fs.chmodSync(browserTmp, 0o700);
    let server, browser;
    const webUrl = `http://127.0.0.1:${webPort}`;
    const childEnv = { PATH: process.env.PATH, NODE_ENV:'development', API_BASE_URL:apiUrl, SENTRY_DISABLED:'true', NEXT_PUBLIC_SENTRY_DISABLED:'true', NEXT_TELEMETRY_DISABLED:'1', TMPDIR:work };
    try {
        const log = fs.openSync(logFile, 'a', 0o600);
        server = spawn(process.execPath, [path.join(app,'node_modules/next/dist/bin/next'),'dev',shadow,'--webpack','--port',String(webPort),'--hostname','127.0.0.1'], { cwd:shadow, env:childEnv, detached:true, stdio:['ignore',log,log] }); fs.closeSync(log);
        const onAbort = () => { void stop(server); void stop(browser); };
        signal.addEventListener('abort', onAbort, { once:true });
        try {
            const aiRoutes = ai ? [`/projects/${fixture.matterId}/assistant/chat/${fixture.chatId}`] : [];
            for (const route of [...aiRoutes, '/login', '/assistant', `/projects/${fixture.matterId}`, `/projects/${fixture.matterId}/overview`, `/projects/${fixture.matterId}/drafts`, '/api/auth/session']) {
                await until('candidate web '+route, async () => {
                    if (server.exitCode !== null) throw new Error('Candidate web boot failed: '+fs.readFileSync(logFile,'utf8').slice(-2200));
                    try { const response=await fetch(webUrl+route,{signal:AbortSignal.any([signal,AbortSignal.timeout(150000)])}); await response.arrayBuffer(); return response.status<500; } catch(error) { if(signal.aborted) throw error; return false; }
                },180000);
            }
            const log = fs.openSync(browserLog,'a',0o600);
            browser = spawn(process.execPath,[path.join(repo,'tests/browser/node_modules/@playwright/test/cli.js'),'test','--config',configPath,`--project=${browserProject}`,'--workers=1','--retries=0','--reporter=list','--output',path.join(work,'browser-output')], { cwd:repo, env:{...childEnv,TMPDIR:browserTmp,CI:'1',PLAYWRIGHT_BASE_URL:webUrl,NORTHWRIT_ACCEPTANCE_MANIFEST:manifest},detached:true,stdio:['ignore',log,log] }); fs.closeSync(log);
            const code = await new Promise((resolve,reject) => {browser.once('error',reject); browser.once('exit',resolve);});
            if (code !== 0) throw new Error('Connected browser acceptance failed: '+fs.readFileSync(browserLog,'utf8').slice(-3800));
        } finally { signal.removeEventListener('abort',onAbort); }
    } finally { await stop(browser); await stop(server); await fs.promises.rm(browserTmp, {recursive:true,force:true}); }
};
