# NorthWrit CI inventory

Only workflows in the root `.github/workflows/` directory execute in this repository. The active workflows are [NorthWrit CI](../../.github/workflows/northwrit-ci.yml) and [container builds](../../.github/workflows/container-builds.yml). An inventory entry is not a claim that a GitHub run passed.

## Active checks

| Job | Checks | Dependencies |
|---|---|---|
| Repository | `check:repo`, `check:whitespace`, workspace audit boundary tests, branding guard and its regression tests | Node.js and Git; no application install or services |
| API | Frozen install, backend tests, production/test/contract type checks, build | Root lockfile; selected API workspace |
| Web | Frozen install, tests, lint, type check, production build | Root lockfile; selected web workspace |
| Word | Frozen install, HTTP host tests, type checks and production build | Root lockfile; selected Word workspace; reserved build-only web/add-in URLs |

The application jobs run root npm aliases, preserving their exit status. Telemetry is disabled for verification. Change filters include root command/configuration files, repository tooling, documentation and application paths so a renamed entry point cannot silently bypass validation. None of these jobs deploys, publishes images or starts the standalone cloud baseline.

## Container build gate

`container-builds.yml` builds API, web and Word images from the repository root on relevant pushes and pull requests. The API job also builds the worker image from the same API artifact. These checks perform no image push, deployment or publication. `northwrit-ci.yml` additionally runs source/compiled worker process tests after the API build. Its existing backend, frontend and word-addin check names are preserved while package paths change, so existing required-check names continue to resolve.

## Imported workflow disposition

The inactive workflow examples below were retired from the working tree under [ADR 0004](../decisions/0004-retire-source-reference-archive.md). They remain recoverable from Git revision `bca9d136480a4cca23c7a7d0fc53516d7233c814`. The table records adoption decisions and outstanding gates, not active automation.

| Imported file | Disposition and prerequisite |
|---|---|
| `ci.yml` | Root NorthWrit CI covers builds and ordinary tests. Coverage thresholds and additional upstream script checks are not yet adopted as root gates. |
| `word-addin.yml` | Root CI covers Word host tests, types and build. Browser/WebKit and Office-host validation require explicit integration. |
| `docker-images.yml` | Adopt when image verification is required for a build-context/import change. The adapted root `container-builds.yml` now validates affected images from the expanded repository root with pushes disabled. |
| `e2e.yml` | Adapt for Phase 4 workflow verification with isolated synthetic data and explicit model/stub outcomes. No live browser workflow is established by the root unit jobs. |
| `stack-tests.yml` | Adapt for real database/auth/access tests when their services and scoped lifecycle are configured. Not run during this repository organization. |
| `schema-drift.yml` | Adopt alongside schema changes to compare fresh and upgraded databases, with updated migration paths and pinned prerequisites. |
| `stack-script.yml` | Adopt if lifecycle/cleanup scripts change; its fixture tests require scoped Docker resources. No cleanup sweep is invoked by root setup or test commands. |
| `security.yml` | Review audit tooling, lockfile paths and exception policy before adding a root dependency-security gate. |
| `codeql.yml` | Review supported languages, build mode, permissions and paths before enabling code scanning. |
| `gitleaks.yml` | Adapt scan scope and baseline policy before enabling a root secret-scan workflow. Keep credentials out of commits meanwhile. |
| `scorecard.yml` | Review repository identity, scheduled permissions and release settings before enabling. |
| `mutation.yml` | Retain for optional deeper regression analysis; establish runtime/cost budgets and targets before scheduling. |
| `desktop.yml` | Defer desktop packaging until macOS/signing/release requirements are in scope. |
| `publish-images.yml` | Do not enable without NorthWrit registry identity, credential permissions, source labels and a reviewed release process. No publication is part of organization. |

## Verification policy

Run the smallest checks that can catch the change, as required by [application instructions](../../apps/AGENTS.md). A Dockerfile, build-context, tsconfig or cross-application import change additionally requires an affected image build. A host build does not prove that a Docker context contains all inputs.

Browser/database acceptance tests must state their environment, synthetic fixtures and authorization outcomes. Root CI does not replace the Phase 4 two-user/two-matter checks. Record known inherited failures separately from failures introduced by a change.

The [isolated source-journey runner](NorthWrit-Phase-4-Source-Journey-Verification.md) now supplies a manual, fresh-stack model-free integration check. Its optional `--work-products` and `--schema-baseline <ref>` modes now cover the [4D saved-draft backend](NorthWrit-Phase-4D-Backend-Verification.md) on fresh and pinned-upgrade schemas. It is not an adopted required GitHub job or a substitute for the remaining browser, full upgrade and security acceptance gates.

## Root workspace installation

Application jobs cache `package-lock.json` and run targeted frozen installs from the root. Container contexts include root manifests, `.npmrc` and every workspace manifest before selecting an application with `npm ci --workspace <path> --include-workspace-root=false`. Root override policy applies consistently. Check names remain unchanged. Audit tooling selects the requested workspace dependency closure from the root lock; root dependency paths cannot inherit a child-path exception.
