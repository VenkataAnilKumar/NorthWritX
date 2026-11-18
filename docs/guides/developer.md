# NorthWrit developer guide

The application spans `apps/` and root `packages/`, and its pinned source is recorded in the [provenance record](../06-technical/NorthWrit-Source-Provenance.md). Use the [implementation plan](../07-implementation/NorthWrit-Implementation-Plan.md) for delivery status and the [source audit](../07-implementation/NorthWrit-Source-Audit.md) for the pinned-source findings. Use the [current implementation](../06-technical/NorthWrit-Current-Implementation.md) for the working stack. Older architecture proposals describe requirements for future phases.

## Source layout

| Directory in the application | Contents |
|---|---|
| `apps/web/` | Next.js workspace, authentication screens and same-origin API gateway |
| `apps/api/` | Express API, document processing, model and tool calls, database schema and migrations |
| `apps/word-addin/` | Office.js task pane, manifest and Word build |
| `apps/desktop/` | Electron desktop shell |
| `apps/worker/` | Standalone entry to the API-owned job runtime |
| `infra/` | Compose and supporting infrastructure configuration |
| `packages/` | Shared TypeScript contracts, client and UI |

## Build and validation

Use Node.js 22 or later. The [root README](../../README.md#install-and-run) documents root npm aliases and package installation. Run `npm run check:repo`, then `npm run setup` from the repository root, or install an individual target with `setup:api`, `setup:web` or `setup:word`. The nine private workspaces share the root lockfile under [ADR 0003](../decisions/0003-npm-root-workspace.md). Use a full `setup` when working across targets; targeted frozen installs replace the current dependency tree. Shared imports use `@northwrit/*`.

Run `npm run dev:api` and `npm run dev:web` in separate terminals after configuring the documented infrastructure. Follow the [application local-development procedure](../../docs/engineering/local-development.md) for auth, storage and local email. Shell commands in the local-development guide start at the repository root unless a step explicitly changes directories.

Use `test:api`, `test:web`, `test:word`, `typecheck`, `lint` and `build` from the repository root as appropriate. Targeted test arguments are forwarded, for example `npm run test:api -- src/__tests__/architecture.test.ts --maxWorkers=2`. The [application build instructions](../../README.md#verify-changes) and root README describe required Word build URLs. A localhost cloud service needs a working Desktop or forwarding route for interactive use on another computer.

The [repository workflow](../../.github/workflows/northwrit-ci.yml) validates these aliases and runs package builds and checks. The [CI inventory](../07-implementation/NorthWrit-CI-Inventory.md) distinguishes those active checks from imported, inactive workflows. Do not restart the archived standalone cloud baseline test as part of repository organization. A passing unit suite does not establish database, browser or model acceptance.

Run `npm run check:branding` after documentation/source changes and upstream updates. Its [compatibility manifest](../../scripts/branding-compatibility.json) protects reviewed identifiers and historical snapshots. The [Python import script](../../scripts/configure_northwrit.py) is a historical transformation tool, not the current acceptance check; do not mechanically rename stored formats or protected identifiers. Preserve license notices, review all changes to build and migration inputs, and verify that authentication and deployment settings point to the intended NorthWrit environment.

## Ownership and Phase 4

Read the [ownership map](../06-technical/NorthWrit-Repository-Ownership.md), [expanded layout decision](../decisions/0002-expanded-repository-structure.md) and [Phase 4 extension map](../07-implementation/NorthWrit-Phase-4-Extension-Map.md) before adding new modules. Preserve shared package boundaries and compatibility-sensitive Projects data. The expanded directory migration is merged under [ADR 0002](../decisions/0002-expanded-repository-structure.md). The root npm workspace is also merged; the new paths and commands are reflected in the root README. See the migration verification record for layout validation and the [workspace record](../07-implementation/NorthWrit-Workspace-Verification.md) for dependency consolidation.

## Product requirements

Track requirements by ID in the [feature specification](../04-specs/Northwrit_Feature-Spec.md). Use the [workflow contracts](../04-specs/Northwrit_Workflow-Contracts.md) for authorization, evidence links, data handling and version-bound approvals. These requirements need executable tests before pilot release.

## Documentation changes

Use `npm run check:repo`, `npm run check:branding` and `npm run check:whitespace` for a documentation pass. Check new or edited relative links against their destination files. Update the [documentation index](../README.md) when adding a guide, and the implementation plan when a milestone's evidence changes. Preserve historical verification results; append later evidence or link to the milestone that supersedes them. Documentation-only changes do not require starting application services.

## Product and architecture orientation

Read the [product catalogue](../02-product/NorthWrit-Product-Catalogue.md), [runtime architecture](../06-technical/NorthWrit-Current-Implementation.md), [system flows](../06-technical/NorthWrit-System-Flows.md) and [administrator guide](administrator.md) before changing a cross-surface capability. The [documentation coverage map](../07-implementation/NorthWrit-Documentation-Coverage.md) connects source, tests and engineering guides. The [105-feature matrix](../04-specs/NorthWrit-Capability-Matrix.md) distinguishes current building blocks from target acceptance.


## Development workflow

Read the root [AGENTS.md](../../AGENTS.md), [application instructions](../../apps/AGENTS.md), and applicable child instructions before editing code. For Next.js work, read the relevant installed Next.js documentation identified by the web instructions. Check the current implementation plan and the requirement IDs affected by the change.

Inspect Git status and preserve existing edits before starting. **Never build AI Slop.** Deliver a real, usable NorthWrit workflow with purposeful design, reliable state, clear errors and verified results. Each visible control must support its intended action. Trace product claims to working behavior and evidence.

### Required delivery process for every phase

| Stage | Required work and output |
| --- | --- |
| Research | Inspect the existing product, source, architecture, requirements, prior evidence and current user problem. Record reusable capabilities and actual gaps before choosing changes. |
| Web search | Research current official competitor, platform and integration documentation. Record source URLs, access dates, relevant findings and limitations. Distinguish vendor claims from verified NorthWrit behavior. Record any research access blocker explicitly. |
| Requirement gathering | Use the previously supplied competitors to identify candidate capabilities. Map each to a NorthWrit user/job, existing requirement ID, current gap, priority, proposed phase and measurable acceptance criteria. Record assumptions and scope decisions. Include permission, persistence, failure, concurrency and recovery requirements where relevant. |
| Design | Define navigation, user flow, information hierarchy, interactions, data entry, loading/empty/error states and accessible behavior. Reuse the design system and test realistic content and narrow layouts. Produce reviewable designs for the actual workflow. |
| Architecture | Review domain ownership, UI/API contracts, data/version model, migrations, access rules, background execution and affected clients. Reuse established boundaries and document structural decisions through the existing ADR process. |
| Implementation | Build working behavior through the normal entry points. Connect UI, API, storage and jobs as needed. Preserve existing data and shared consumers. Handle retries, conflicting edits and partial failures. |
| Review | Review behavior against requirements and designs, inspect the diff, check permissions, privacy, compatibility, accessibility and maintainability, then resolve findings. Record who performed the review and distinguish self-review, automated checks and specialist review. |
| Test | Run meaningful regressions at the appropriate layers. Exercise the complete user journey with real services where required, including denied access and failure paths. Verify fresh/upgrade databases for schema changes and live model output/evidence for AI-dependent behavior. Record commands, outcomes, defects, limitations and remaining acceptance work. |

Complete the required stages for every phase and keep their records proportional to its scope. A phase record should identify the user problem, competitor/source findings, selected requirement IDs and exclusions, acceptance criteria, design/architecture decisions, implementation changes, review findings, test results and open items. Carry this traceability into the PR and verification record.

After relevant checks pass, commit a focused increment with its behavior and validation. Push and merge when authorized, after required GitHub checks pass. Keep deployment and external publication within their separately authorized scope.

### Competitor-informed requirements

Use Harvey, Clio and Filevine as the starting product comparison set supplied by the user. Research their current workflows and identify which capabilities address NorthWrit's selected legal use cases. The existing [cross-platform feature backlog](../07-implementation/NorthWrit-Cross-Platform-Feature-Backlog.md), [feature specification](../04-specs/Northwrit_Feature-Spec.md), [capability matrix](../04-specs/NorthWrit-Capability-Matrix.md) and phased delivery plan retain requirement ownership and scope.

For each candidate, record the competitor capability and source, NorthWrit use case, existing implementation, gap, proposed behavior, acceptance tests, dependency/cost/access constraints, priority and phase. State the adoption decision and rationale. Keep unselected capabilities in the backlog. Design a distinctive NorthWrit experience and preserve the approved product terminology.

CompanyOS, kdrive and Cognee are also user-supplied research references. Consult them for relevant architecture, document/storage or knowledge-context decisions and document the specific fit. Evaluate any proposed dependency against its current license, API, maintenance, access requirements and NorthWrit's deployment needs before adoption.

### Completion evidence

A useful phase delivers functioning behavior with persisted data, enforced permissions and clear failure recovery where applicable. Verify it through the same entry points users use. Keep mocked tests, seeded fixtures, recorded-output browser tests, screenshots and fresh end-to-end runs accurately labeled. AI-dependent completion requires live inference and checked evidence. Record unsupported or unevaluated behavior as open work.

Use current primary guidance to shape relevant criteria. OWASP ASVS supplies security-verification requirements, WCAG 2.2 supplies testable accessibility criteria, and Playwright recommends isolated tests, user-facing locators and actionability checks. Select the criteria relevant to the feature and record the checks performed. These sources were consulted on November 17, 2026 in the Toronto client timezone. [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) · [WCAG 2.2](https://www.w3.org/TR/WCAG22/) · [Playwright best practices](https://playwright.dev/docs/best-practices)

Keep feature status aligned with the [phased delivery plan](../07-implementation/NorthWrit-Phased-Delivery-Plan.md). Existing Phase 4 evidence includes a live local-model example and persisted-output browser checks. Broader model evaluation, Word-host behavior and remaining review gates stay explicit. Use the [Ollama verification record](../07-implementation/NorthWrit-Phase-4-Ollama-Verification.md) for those exact boundaries.

## Building the right product

| Decision | Instruction |
| --- | --- |
| User and outcome | Identify the target user, their current workflow, the problem and a measurable success criterion before selecting features. Use available user feedback and task evidence. Record assumptions that still need validation. |
| Adoption | Explain why a capability is useful to NorthWrit users, how they discover and complete it, and what they gain over their current process. Use competitor capabilities as research inputs and document the adoption rationale. |
| Scope | Deliver the smallest complete workflow that produces a useful result. Use a clear definition of done, explicit exclusions and dependencies. Keep navigation, terminology and interaction behavior consistent across the product. |
| Legal and AI quality | Define evaluation cases and expected outcomes before changing prompts, retrieval or model behavior. Check exact sources/versions, claim support, missing evidence, conflicting documents, prompt injection and honest failure states. Record model/prompt settings and regression outcomes. Obtain qualified legal evaluation when making legal-quality claims. |
| User control and data | Make the selected workspace, matter, model and consequential action clear. Enforce account/matter isolation across retrieval, jobs, connectors and exports. Honor user provider/settings choices and required action approvals. Define relevant retention and deletion behavior. |
| Performance and cost | Measure latency, resource use and model/tool costs for representative workloads. Establish realistic budgets for the selected workflow and expose useful progress, cancellation and recovery behavior. Record actual hardware and limits alongside measurements. |
| Operational readiness | For runtime changes, identify migration order, configuration, observable failures, recovery and rollback. Verify installation/upgrade paths affected by the change and document how to diagnose failures without exposing sensitive data. |
| Learning and prioritization | Evaluate the delivered workflow against its success criterion, record remaining friction and prioritize follow-up work from evidence. Keep future work and unverified capabilities explicit. |

Use reasonable, reversible assumptions to keep work moving and identify them in the phase record. Ask the user when a missing requirement changes scope, legal meaning, data exposure, irreversible behavior or a consequential product decision. Keep verification proportional to the change and reuse existing evidence when it still applies. These instructions do not create an additional approval requirement for routine authorized implementation.

## Local development commands

Run commands from the repository root. Use Node.js 22 or later and the npm version declared by packageManager in package.json. The root package-lock.json is authoritative.

```bash
npm run setup
npm run check:repo
npm run check:branding
```

Configure Auth, storage, database and email using the linked local-development procedure. Copy example environment files only for a fresh configuration and preserve existing values. The web server uses API_BASE_URL for its server-side connection to the API. Keep provider and service credentials in backend configuration. See the [administrator guide](administrator.md) for instance settings.

Start configured application processes in separate terminals:

```bash
npm run dev:api
npm run dev:web
```

For a standalone worker, set WORKERS_MODE=none on the API, then use npm run build:worker and npm run start:worker in the worker terminal. The [worker guide](../../apps/worker/README.md) describes roles and queue configuration. The Word development process uses npm run dev:word after HTTPS configuration and sideloading prerequisites. Desktop development uses npm --workspace apps/desktop run dev after configuring the application connection. See the [Word guide](../../apps/word-addin/README.md) and [desktop guide](../../apps/desktop/README.md).

## Architecture and data rules

| Area | Developer instruction |
| --- | --- |
| Backend | Keep routes thin and domain logic in modules. Import another module through its named service facade. Place cross-domain workflows in application, and shared infrastructure in lib. Follow the backend architecture dependency rules. |
| Web | Centralize backend requests in apps/web/src/app/lib/northwritApi.ts. Use existing shared UI primitives, design tokens, accessible labels and visible loading/error states. |
| Shared packages | Put serialized contracts in packages/contracts. Keep packages/client framework-free and shared UI in packages/ui. Preserve package boundaries. |
| Worker | Keep handlers API-owned. Recheck relevant authorization when queued work publishes results. |
| Database | Add a date-sequenced migration, update schema.sql and its migration ledger, preserve RLS/grants/search paths, and test fresh and supported-upgrade paths. |
| Evidence and drafts | Retain exact document/version identities and hashes. Keep immutable saved revisions, compare-and-save conflict handling and source verification consistent across clients. |
| Privacy and errors | Keep credentials, real client documents and browser authentication state out of Git and logs. Use the established safe-error helpers for user-facing failures and diagnostic reporting. |

Use the [backend architecture](../engineering/backend-architecture.md), [design system](../engineering/design-system.md), and [ownership map](../06-technical/NorthWrit-Repository-Ownership.md) for implementation detail.

## Build and test commands

Choose the checks affected by the change. Root build runs API, web and Word builds. Worker and desktop have their own commands and runtime acceptance.

| Purpose | Root command |
| --- | --- |
| API production types | npm run typecheck:api |
| API tests and shared contracts | npm run typecheck:api-tests and npm run typecheck:contracts |
| Web and Word types | npm run typecheck:web and npm run typecheck:word |
| All configured type checks | npm run typecheck |
| Focused API regression | npm run test:api -- src/__tests__/architecture.test.ts |
| Web/shared regressions | npm run test:web |
| Word host tests | npm run test:word |
| Worker launcher tests | npm run build:api followed by npm run test:worker |
| Desktop local-runtime tests | npm run test:desktop |
| Web lint | npm run lint:web |
| API/web builds | npm run build:api and npm run build:web |
| Word build | Configure the build URLs, then npm run build:word |
| Repository checks | npm run check:repo, npm run check:branding and npm run check:whitespace |

For a build-only Word check in Bash, use reserved example origins:

```bash
WORD_ADDIN_PUBLIC_URL=https://northwrit.invalid REACT_APP_WEB_APP_URL=https://app.northwrit.invalid npm run build:word
```

Use the intended deployment origins for release artifacts. Build success and host acceptance have separate evidence. Run database and browser suites against documented disposable services with synthetic data. Preserve other tasks' containers and volumes, and read the cleanup scope before using stack helpers. Follow [safe local testing](../engineering/safe-local-testing.md) and the [E2E procedure](../engineering/e2e-ci.md).

## Matter AI and local-model verification

General Assistant chat uses POST /chat. Matter-scoped chat uses POST /projects/:projectId/chat, exposed by streamProjectChat in the centralized web API client. Use the matter endpoint when testing matter documents and their tools. Creating a chat with project_id and then posting to general chat does not exercise the same document context.

NorthWrit discovers local Ollama models through GET /models/ollama and uses IDs such as ollama/qwen2.5:3b. OLLAMA_BASE_URL must be reachable from the API process. A host-run API can reach a host-local Ollama service at http://127.0.0.1:11435/v1 in the recorded isolated setup. A container needs an address reachable from its own network namespace. See [local model setup](../engineering/local-development.md#local-models-with-ollama).

For slow CPU-only evaluation, the recorded disposable API used these aligned limits:

```dotenv
STREAM_FIRST_CHUNK_TIMEOUT_MS=420000
STREAM_IDLE_TIMEOUT_MS=600000
```

Measure runtime on the chosen model and hardware before choosing instance settings. These values preserve bounded requests and describe the evaluated CPU setup. Keep model selection and inference configuration explicit in the test record.

Model-produced citation metadata must still resolve to the correct source version and pass server-side quote verification. A useful regression checks an agreement and superseding amendment, the controlling notice period, supporting passage, cross-matter denial, revoked access, saved draft and DOCX export. Record a replayed browser fixture as replayed data. Keep fresh inference evidence and browser screenshots traceable to their own runs.

## Review and handoff

Include the problem, resulting behavior, affected contracts/migrations and validation in the pull request. Link the relevant verification record and retain known limitations. Use the authenticated contributor's privacy-preserving GitHub identity when required by repository settings. Wait for required CI checks and resolve relevant failures before merging.

Deployment, publishing and changes to external services require their own task authorization. Preserve source attribution and compatibility-sensitive identifiers, keep commits focused, and leave the checkout with a clear account of pending changes.
