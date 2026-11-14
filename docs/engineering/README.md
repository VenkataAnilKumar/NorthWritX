# NorthWrit engineering documentation

Use the [developer guide](../guides/developer.md) for setup, the [current implementation](../06-technical/NorthWrit-Current-Implementation.md) for the working stack, and the [implementation plan](../07-implementation/NorthWrit-Implementation-Plan.md) for delivery status. These guides describe existing engineering interfaces; product targets are indexed separately in the [documentation index](../README.md).

## Product and architecture references

- [Product catalogue](../02-product/NorthWrit-Product-Catalogue.md) — supported surfaces, configuration and limits
- [System flows](../06-technical/NorthWrit-System-Flows.md) — sessions, ingestion, streams, approvals, exports and recovery
- [User guide](../guides/user-guide.md) and [administrator guide](../guides/administrator.md) — task and operating guidance
- [Documentation coverage](../07-implementation/NorthWrit-Documentation-Coverage.md) — implementation references and detailed guide inventory

## Run and deploy NorthWrit

- [Local development](local-development.md) — Docker Compose, local services,
  registration, Ollama, and first-run setup
- [Manual and production deployment](deployment.md) — managed infrastructure,
  environment variables, database upgrades, and deployment safety
- [Troubleshooting](troubleshooting.md) — common local and production problems
- [Safe local testing](safe-local-testing.md) — disposable resources, synthetic
  documents, and secret handling

## Features and clients

- [Organization offboarding](organization-offboarding.md) — member removal,
  account deletion, shared-work transfer and owner-only recovery
- [MCP connectors](connectors.md) — hosted presets, custom servers, OAuth,
  redirect URIs, and Slack/Google deployment setup
- [Scoped memory](memory.md) — app and project Markdown memory, permissions,
  asynchronous learning, deletion, and operations
- [Google Workspace](google-workspace.md) — Drive, Gmail, and Calendar
  connectors: setup, permissions, approvals, limits, and acceptance tests
- [CourtListener integration](courtlistener.md) — live US case-law tools and
  optional bulk data
- [Web search](web-search.md) — provider search and search services, page
  reading, keys, and safety
- [Subagents](subagents.md) — delegated tasks, what they may do, approvals,
  and limits
- [Microsoft Word add-in](../../apps/word-addin/README.md) — concise setup and command
  reference
- [Word add-in development and deployment](word-addin-development.md) — manual
  setup, sideloading, builds, storage behavior, testing, and troubleshooting
- [Tamper-evident exports](tamper-evident-exports.md) — document hashes and
  optional signed manifests

## Backend

- [Backend architecture](backend-architecture.md) — domain modules over a
  shared kernel: module anatomy, the service contract, the layering rules, and
  the fitness test that enforces them

## Frontend

- [Design system](design-system.md) — color/typography/spacing tokens, the shared
  `components/ui` primitives, and the accessibility baseline

## Testing and CI

- [Active CI inventory](../07-implementation/NorthWrit-CI-Inventory.md) — repository, application and container checks; remaining integration/release gaps
- [Observability](observability.md) — explicit operator DSNs, privacy filtering and local reporting checks

- [End-to-end tests in CI](e2e-ci.md)
- [Backend unit-test coverage](testing-coverage.md)
- [Frontend unit-test coverage](frontend-testing.md)
- [Mutation testing and the SSE load harness](test-depth.md)

## Open-source acknowledgments

- [Open-source credits](../../Credit.md) — the libraries, tools, and
  infrastructure behind NorthWrit

## Historical design and investigation notes

These files preserve the context of completed work. They are not current setup
or architecture guidance.

- [Legal workflows design spec](superpowers/specs/2026-06-29-legal-workflows-design.md)
- [Word add-in assistant scroll-jump report](word-addin-chat-scroll-report.md)

Contribution and disclosure policies live in [CONTRIBUTING.md](../../CONTRIBUTING.md)
and [SECURITY.md](../../SECURITY.md).
