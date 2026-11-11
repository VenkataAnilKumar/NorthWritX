import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Stage an isolated workspace install without copying credentials or app source.
const root = fileURLToPath(new URL('../', import.meta.url));
const destination = resolve(process.argv[2] ?? '');
if (!process.argv[2] || destination === root.replace(/\/$/, '')) {
  throw new Error('Supply a separate destination for the workspace manifests.');
}
const manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
for (const file of ['package.json', 'package-lock.json', '.npmrc', ...manifest.workspaces.map(dir => `${dir}/package.json`)]) {
  const target = resolve(destination, file);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(resolve(root, file), target);
}
