import assert from 'node:assert/strict';
import { test } from 'node:test';
import { selectWorkspaceLock } from './audit-workspace-lock.mjs';

const workspaces = ['apps/web', 'apps/api', 'packages/ui'];
const lock = { packages: {
  'apps/web': { dependencies: { '@northwrit/ui': '0.0.0', 'client-only': '1' } },
  'apps/api': { dependencies: { private: '1' } },
  'apps/web/node_modules/client-only': { version: '1' },
  'apps/api/node_modules/private': { version: '1' },
  'node_modules/@northwrit/ui': { link: true, resolved: 'packages/ui' },
  'packages/ui': { peerDependencies: { react: '19' } },
  'node_modules/react': { version: '19', dependencies: { scheduler: '1' } },
  'node_modules/react/node_modules/scheduler': { version: '1' },
} };
test('audits shared peers and their transitive graph without another app dependencies', () => {
  const selected = selectWorkspaceLock(lock, 'apps/web', workspaces).packages;
  assert.ok(selected['node_modules/react']);
  assert.ok(selected['node_modules/react/node_modules/scheduler']);
  assert.ok(selected['apps/web/node_modules/client-only']);
  assert.ok(!selected['apps/api/node_modules/private']);
});
test('fails closed if a declared dependency is missing', () => {
  const broken = structuredClone(lock);
  delete broken.packages['node_modules/react'];
  assert.throws(() => selectWorkspaceLock(broken, 'apps/web', workspaces), /Missing locked dependency/);
});
test('rejects unknown workspaces and links escaping the declared membership', () => {
  assert.throws(() => selectWorkspaceLock(lock, 'apps/unknown', workspaces), /Unknown/);
  const broken = structuredClone(lock);
  broken.packages['node_modules/@northwrit/ui'].resolved = '../other-project';
  assert.throws(() => selectWorkspaceLock(broken, 'apps/web', workspaces), /Unexpected workspace link/);
});
