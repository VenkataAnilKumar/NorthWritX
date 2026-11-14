import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { checkBranding } from './check-branding.mjs';
const previous = ['Mi', 'ke'].join('');
const hash = value => createHash('sha256').update(value).digest('hex');
test('rejects new references even next to an approved compatibility line', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'northwrit-brand-'));
  try {
    const legacy = `const alias = "${previous.toLowerCase()}:status";`;
    writeFileSync(path.join(root, 'surface.ts'), `${legacy}\nconst title = "${previous}";`);
    const manifest = { files: [], lines: [{ path: 'surface.ts', sha256: hash(legacy), reason: 'old IPC clients' }] };
    const result = checkBranding(root, ['surface.ts'], manifest);
    assert.equal(result.problems.length, 1);
    assert.match(result.problems[0], /surface.ts:2: unreviewed/);
    assert.ok(!result.problems[0].includes(legacy));
  } finally { rmSync(root, { recursive: true }); }
});
test('detects stale exceptions and modified historical content', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'northwrit-brand-'));
  try {
    writeFileSync(path.join(root, 'snapshot.md'), 'updated content');
    const result = checkBranding(root, ['snapshot.md'], { lines: [{ path: 'gone.ts', sha256: hash(previous), reason: 'retired' }], files: [{ path: 'snapshot.md', sha256: hash('original'), reason: 'history' }] });
    assert.equal(result.problems.length, 2);
  } finally { rmSync(root, { recursive: true }); }
});
