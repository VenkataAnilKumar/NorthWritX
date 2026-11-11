# Root workspace verification

Date: November 11, 2026. Branch: `refactor/npm-root-workspace`. Verification was performed locally; Git history records the submitted changes. No GitHub check result or merge is claimed for this branch.

Nine private npm workspaces share one root lockfile. Active package identities/imports use `@northwrit/*`; attribution and compatibility-sensitive identifiers remain. Fixture directories remain outside workspace membership. This follows PR #2 and does not implement Phase 4.

Host tooling: Node.js 24.22.1/npm 11.9.0. Full application suites use Node.js 22.23.4; containers use Node.js 22/npm 10.9.9.

## Verification

| Check | Result |
|---|---|
| Frozen installation | Passed in a separate metadata staging directory: 3,325 packages, lifecycle scripts enabled, Electron's documented proxy support, root lock hash unchanged |
| Dependency tree | `npm ls --workspaces --depth=0` passed for all nine workspaces |
| Repository and whitespace | Passed: nine workspace lock entries, root command targets, 129 local links and CI inventory |
| Types | API production/test/contracts, web, and Word app/E2E checks passed; web types passed again after the chat-title fix |
| Host production builds | API, web and Word passed; web lint passed with zero errors and 29 inherited warnings |
| Container builds | API, worker, web and Word images built successfully; no images pushed |
| Audit tooling | All 44 graph-selection and audit-gate tests passed |
| Worker process | Both source/compiled lifecycle tests passed |
| Word HTTP host | All three tests passed |
| Desktop | 18 passed, one skipped because bundled native PostgreSQL was not fetched |
| Full API | 5,142 passed, 102 skipped, two failures; details below |
| Full web | All 422 files executed: 4,335 passed, one icon snapshot failure; the reviewed correction subsequently passed all five affected popup tests |

The web/Word builds retain the existing CSS/webpack warnings. Web TypeScript initially retained old module-resolution errors in its generated incremental cache; clearing `apps/web/tsconfig.tsbuildinfo` restored the normal command. Fresh CI checkouts do not contain that cache. The README setup instructions describe this one-time transition.

## API host limitations

The full API run hit the migration suite's existing 20-second timeout. All 21 migration tests passed in the subsequent one-worker run. The diagnostic and dependency-cycle suites also passed an earlier isolated rerun (49 passing tests across those three suites).

The process-limit fixture expects fake LibreOffice process IDs before a short cold-start deadline and reports `expected [] to have a length of 2` on this host. Three of its four tests pass. The [layout migration record](NorthWrit-Migration-Verification.md) already reproduces this exact failure against original source. No extraction implementation, assertion or timeout was changed. The complete API run is not recorded as passing.

The branding checker reports seven existing raster-icon byte differences under Pillow 13.0.0. Every flagged asset is unchanged by this task; the earlier migration record documents the same baseline differences. No active `@mike/*` package imports remain, and database/migration files are unchanged.

## Dependency graph and regression corrections

The original graphs seeded the root lock rather than broadly updating dependencies. The consolidated graph resolves Lucide from 1.66.0 to 1.72.0 and adds a tslib 2.9.1 copy within existing declared ranges. Other package/version pairs already existed in the independent locks; installation locations and peer sharing change. Existing security overrides are consolidated at the root.

Lucide's generated warning-icon class aliases changed. Review of the complete popup snapshot diff showed one SVG class-name line; that expected line now matches the locked dependency. All five popup tests pass with the exact markup assertion retained.

An existing regression test also exposed a missing initial chat title while message history was pending. The mount-time chat-list response now sets the title with the initial model/reasoning settings, guarded against a thread switch before the response arrives. All 22 existing TRChatPanel tests pass. No assertions or time limits were weakened.

## Boundaries

Full database, Office-host, browser workflow and signed macOS packaging acceptance remain separate checks. The production API metadata staging install validates the desktop dependency boundary; it does not establish a signed desktop release. No deployment, publication, standalone cloud baseline restart or unrelated resource cleanup occurred. Only the task-created temporary frozen-install copy was removed after its checks passed; verification logs were retained.
