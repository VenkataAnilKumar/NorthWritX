import { posix } from 'node:path';

// Follow the actual locked graph, including shared-workspace peers. Auditing a
// workspace must neither omit its root peers nor inherit another app's waiver.
export function selectWorkspaceLock(lock, workspace, workspaces) {
  if (!lock.packages || !workspaces.includes(workspace)) throw new Error('Unknown audit workspace or missing root lock graph');
  const packages = {};
  const visited = new Set();
  const resolve = (parent, name) => {
    let base = parent;
    for (;;) {
      const candidate = posix.join(base, 'node_modules', name);
      if (Object.hasOwn(lock.packages, candidate)) return candidate;
      if (!base) return undefined;
      base = posix.dirname(base);
      if (base === '.') base = '';
    }
  };
  const visit = path => {
    if (visited.has(path)) return;
    visited.add(path);
    const entry = lock.packages[path];
    if (!entry) throw new Error(`Missing locked workspace target: ${path}`);
    packages[path] = entry;
    if (entry.link) {
      if (!workspaces.includes(entry.resolved)) throw new Error(`Unexpected workspace link: ${entry.resolved}`);
      visit(entry.resolved);
      return;
    }
    const dependencies = { ...entry.dependencies, ...entry.optionalDependencies, ...entry.peerDependencies,
      ...(workspaces.includes(path) ? entry.devDependencies : {}) };
    for (const name of Object.keys(dependencies)) {
      const target = resolve(path, name);
      if (target) visit(target);
      else if (!entry.optionalDependencies?.[name] && !entry.peerDependenciesMeta?.[name]?.optional) {
        throw new Error(`Missing locked dependency: ${path} -> ${name}`);
      }
    }
  };
  visit(workspace);
  return { ...lock, packages };
}
