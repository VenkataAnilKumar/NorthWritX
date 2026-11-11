import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (relative) => readFileSync(path.join(root, relative), "utf8");
const json = (relative) => JSON.parse(read(relative));
const failures = [];
const check = (name, run) => {
  try {
    run();
  } catch (error) {
    failures.push(`${name}: ${error.message}`);
  }
};

const targets = {
  api: "apps/api",
  web: "apps/web",
  word: "apps/word-addin",
  e2e: "tests/browser",
  worker: "apps/worker",
  desktop: "apps/desktop",
};
const documents = [
  "apps/worker/README.md",
  "docs/decisions/0002-expanded-repository-structure.md",
  "docs/07-implementation/NorthWrit-Migration-Verification.md",
  "README.md",
  "AGENTS.md",
  "docs/upstream/mike/NORTHWRIT.md",
  "docs/README.md",
  "docs/guides/developer.md",
  "docs/decisions/0001-repository-structure.md",
  "docs/06-technical/NorthWrit-Repository-Ownership.md",
  "docs/07-implementation/NorthWrit-CI-Inventory.md",
  "docs/07-implementation/NorthWrit-Phase-4-Extension-Map.md",
  "docs/07-implementation/NorthWrit-Implementation-Plan.md",
  "docs/07-implementation/NorthWrit-Repository-Verification.md",
];

check("Node.js", () => assert(Number(process.versions.node.split(".")[0]) >= 22, "Node.js 22 or later is required"));

let manifest;
check("root manifest", () => {
  manifest = json("package.json");
  assert.equal(manifest.private, true);
  assert.deepEqual([...manifest.workspaces].sort(), [...Object.values(targets), "packages/contracts", "packages/client", "packages/ui"].sort(), "workspace membership must match the declared packages");
  assert(!Object.keys(manifest.dependencies ?? {}).length, "root aliases must not add application dependencies");
  assert.equal(json("package-lock.json").packages[""].name, manifest.name);
});

for (const directory of manifest?.workspaces ?? []) {
  check(`${directory} workspace manifest and root lock`, () => {
    const pkg = json(`${directory}/package.json`);
    const lock = json("package-lock.json").packages[directory];
    assert(lock, `root lock is missing ${directory}`);
    assert(!existsSync(path.join(root, directory, "package-lock.json")), "workspace lockfiles must not compete with the root lock");
    assert(pkg.name.startsWith("@northwrit/"), "active packages must use NorthWrit names");
    assert.equal(json("package-lock.json").packages[`node_modules/${pkg.name}`]?.resolved, directory, "workspace must be linked from the root install");
    assert.equal(lock.name, pkg.name);
    assert.equal(lock.version, pkg.version);
    for (const field of ["dependencies", "devDependencies", "peerDependencies", "peerDependenciesMeta"]) {
      assert.deepEqual(lock[field] ?? {}, pkg[field] ?? {}, `${directory}: ${field} differ from lockfile`);
    }
  });
}

if (manifest?.scripts) {
  for (const [name, command] of Object.entries(manifest.scripts)) {
    check(`command ${name}`, () => {
      assert(!command.includes("--if-present"), "checks may not silently skip missing scripts");
      for (const step of command.split(" && ")) {
        const nested = /^npm run (\S+)/.exec(step);
        if (nested) {
          assert(manifest.scripts[nested[1]], `unknown root script ${nested[1]}`);
          continue;
        }
        const delegated = /^npm --workspace (\S+) (ci|test|run)(?: (\S+))?/.exec(step);
        const install = /^npm ci(?: --workspace (\S+))?$/.exec(step);
        if (install) {
          assert(!install[1] || Object.values(targets).includes(install[1]), "unknown setup target");
          continue;
        }
        if (delegated) {
          const [, directory, action, script] = delegated;
          assert(Object.values(targets).includes(directory), `unknown package path ${directory}`);
          const pkg = json(`${directory}/package.json`);
          if (action !== "ci") {
            const key = action === "test" ? "test" : script;
            assert(pkg.scripts?.[key], `${directory}: missing script ${key}`);
            assert(step.includes(" --"), "package run commands must forward arguments after --");
          }
          continue;
        }
        const node = /^node (\S+)/.exec(step);
        if (node) assert(existsSync(path.join(root, node[1])), `missing script ${node[1]}`);
        else assert.equal(step, "git diff --check", `unrecognized repository command ${step}`);
      }
    });
  }
}

let links = 0;
for (const document of documents) {
  check(`links in ${document}`, () => {
    const text = read(document);
    assert(!/Northwrit_MikeOSS|NorthWrit_MikeOSS/.test(text), "old document prefix remains");
    for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
      const target = match[1];
      if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("#")) continue;
      const relative = target.split("#")[0];
      assert(existsSync(path.resolve(root, path.dirname(document), relative)), `missing local target ${target}`);
      links++;
    }
  });
}

check("CI inventory and command paths", () => {
  const workflow = read(".github/workflows/northwrit-ci.yml");
  for (const target of ["api", "web", "word"]) {
    assert(workflow.includes(`target: ${target}`), `missing CI target ${target}`);
    for (const verb of ["setup", "test", "typecheck", "build"]) {
      assert(manifest?.scripts?.[`${verb}:${target}`], `missing CI command ${verb}:${target}`);
      assert(workflow.includes(`npm run ${verb}:`), `CI does not invoke ${verb} aliases`);
    }
  }
  assert(workflow.includes("package-lock.json"), "CI cache must use the root workspace lock");
  assert(workflow.includes("npm run check:repo"), "CI must run repository validation");
  const inventory = read("docs/07-implementation/NorthWrit-CI-Inventory.md");
  for (const name of readdirSync(path.join(root, "docs/upstream/mike/.github/workflows"))) {
    if (/\.ya?ml$/.test(name)) assert(inventory.includes(`\`${name}\``), `imported workflow ${name} has no disposition`);
  }
  for (const name of readdirSync(path.join(root, ".github/workflows"))) {
    if (/\.ya?ml$/.test(name)) assert(inventory.includes(name), `active workflow ${name} is not documented`);
  }
});

check("expanded migration paths", () => {
  const mapping = json("docs/07-implementation/NorthWrit-Migration-Paths.json");
  for (const [oldPath, destination] of Object.entries(mapping.paths)) {
    if (destination.endsWith("/package-lock.json")) {
      assert(json("package-lock.json").packages[path.dirname(destination)], "retired lock must have a root workspace entry");
    } else assert(existsSync(path.join(root, destination)), `missing destination ${destination}`);
    assert(!existsSync(path.join(root, oldPath)), `old path remains ${oldPath}`);
  }
  for (const app of ["api", "web", "worker", "word-addin", "desktop"]) {
    assert(existsSync(path.join(root, "apps", app, "package.json")), `missing app ${app}`);
  }
  assert(existsSync(path.join(root, "infra/docker-compose.yml")));
});

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Repository checks passed: ${manifest.workspaces.length} workspace lock entries, root command targets, ${links} local links and CI inventory.`);
}
