import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const priorBrand = new RegExp(['mi', 'ke'].join(''), 'i');
const digest = value => createHash('sha256').update(value).digest('hex');
export function checkBranding(root, files, manifest) {
  const seen = new Set();
  const problems = [];
  const lines = new Map(manifest.lines.map(entry => [`${entry.path}:${entry.sha256}`, entry]));
  const frozen = new Map(manifest.files.map(entry => [entry.path, entry]));
  let retained = 0;
  for (const relative of new Set(files)) {
    if (!relative || relative.startsWith('docs/upstream/') || ['scripts/check-branding.mjs', 'scripts/branding-compatibility.json'].includes(relative)) continue;
    const file = path.join(root, relative);
    if (!existsSync(file)) continue;
    const bytes = readFileSync(file);
    const exception = frozen.get(relative);
    if (exception && digest(bytes) === exception.sha256) { seen.add(`file:${relative}`); retained++; continue; }
    if (priorBrand.test(path.basename(relative))) problems.push(`${relative}: unexpected legacy filename`);
    if (bytes.includes(0)) continue;
    bytes.toString('utf8').split(/\r?\n/).forEach((line, index) => {
      if (!priorBrand.test(line)) return;
      const key = `${relative}:${digest(line.trim())}`;
      const approved = lines.get(key);
      if (approved?.reason && approved.reason !== "REVIEW_REQUIRED") { seen.add(key); retained++; }
      else problems.push(`${relative}:${index + 1}: unreviewed legacy reference`);
    });
  }
  for (const key of lines.keys()) if (!seen.has(key)) problems.push(`${lines.get(key).path}: stale compatibility exception`);
  for (const key of frozen.keys()) if (!seen.has(`file:${key}`)) problems.push(`${key}: historical snapshot changed or disappeared`);
  return { problems, retained };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const manifest = JSON.parse(readFileSync(path.join(root, 'scripts/branding-compatibility.json'), 'utf8'));
  const files = execFileSync('git', ['ls-files', '-co', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' }).split('\0');
  const result = checkBranding(root, files, manifest);
  if (result.problems.length) { console.error(result.problems.join('\n')); process.exitCode = 1; }
  else console.log(`Branding check passed; ${result.retained} reviewed compatibility/provenance references retained.`);
}
