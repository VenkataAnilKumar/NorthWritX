import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

// The API owns domain services, dependencies, configuration, and worker lifecycle.
// This process boundary deliberately consumes its compiled public worker entry.
const api = fileURLToPath(new URL('../api/', import.meta.url));
process.chdir(api);
if (process.argv.includes('--dev')) {
  const require = createRequire(new URL('../api/package.json', import.meta.url));
  const { register } = require('tsx/cjs/api');
  register();
  require('./src/worker.ts');
} else {
  await import(pathToFileURL(`${api}dist/worker.js`).href);
}
