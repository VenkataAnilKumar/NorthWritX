import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';

// Exercise the actual API-owned runtime through the new process entry. The
// loopback stub has no external credentials or data; job semantics are covered
// by the API runner/authorization suites and real database checks separately.
for (const dev of [false, true]) {
  test(`${dev ? 'source' : 'compiled'} worker polls and shuts down on SIGTERM`, { timeout: 30000 }, async () => {
    const requests = [];
    const server = createServer((req, res) => {
      requests.push(req.url);
      req.resume();
      res.setHeader('content-type', 'application/json');
      res.end(req.url.includes('document_lifecycle_version') ? '2' : '[]');
    });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const child = spawn(process.execPath, [fileURLToPath(new URL('./run.mjs', import.meta.url)), ...(dev ? ['--dev'] : [])], {
      cwd: '/tmp', // the launcher must find and activate API configuration itself
      env: {
        PATH: process.env.PATH,
        SUPABASE_URL: `http://127.0.0.1:${server.address().port}`,
        SUPABASE_SECRET_KEY: 'synthetic-worker-test-key',
        SENTRY_DISABLED: 'true',
        QUEUE_DRIVER: 'postgres',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    child.stdout.on('data', chunk => { output += chunk; });
    child.stderr.on('data', chunk => { output += chunk; });
    const exited = once(child, 'exit');
    try {
      const deadline = Date.now() + 20000;
      while (Date.now() < deadline && child.exitCode === null &&
        (!output.includes('NorthWrit worker process running') || requests.length < 2)) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      assert.match(output, /NorthWrit worker process running/);
      assert.ok(requests.some(url => url.includes('document_lifecycle_version')), output);
      assert.ok(requests.length >= 2, 'runtime must poll after validating lifecycle');
      child.kill('SIGTERM');
      const [code, signal] = await exited;
      assert.equal(code, 0, output);
      assert.equal(signal, null);
      assert.match(output, /Worker shutting down gracefully/);
    } finally {
      if (child.exitCode === null) child.kill('SIGKILL');
      server.closeAllConnections();
      await new Promise(resolve => server.close(resolve));
    }
  });
}
