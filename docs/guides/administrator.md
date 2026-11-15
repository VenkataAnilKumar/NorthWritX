# NorthWrit administrator guide

Reviewed November 14, 2026 against baseline `7c08dba`. This guide covers existing application and operating controls. It does not establish certification, Canadian residency, complete Matter isolation or planned Shield enforcement. Use the [product catalogue](../02-product/NorthWrit-Product-Catalogue.md) and [implementation plan](../07-implementation/NorthWrit-Implementation-Plan.md) for scope.

## Responsibilities

| Responsibility | Who controls it | Reference |
|---|---|---|
| Runtime, secrets, auth origins, storage, workers and backups | Deployment operator | [Local setup](../engineering/local-development.md), [deployment](../engineering/deployment.md) |
| Organization membership, providers and workspace settings | Authorized organization owner/admin according to the operation | [Organization lifecycle](../engineering/organization-offboarding.md) |
| Private archive listing/recovery and privileged private-content controls | Organization owner under the documented rules | [Offboarding](../engineering/organization-offboarding.md) |
| Personal provider keys and connector consent | Individual user; organization configuration is separate | [Providers](../engineering/direct-provider-models.md), [connectors](../engineering/connectors.md) |
| Legal scope and review acceptance | Assigned product/legal reviewers | [Workflow contracts](../04-specs/Northwrit_Workflow-Contracts.md) |

An organization owner is not automatically a deployment operator or the owner of every member's private connection. Avoid using “admin” as shorthand for all these authorities.

## Prepare an instance

Follow the [local-development guide](../engineering/local-development.md) for a disposable development stack or the [deployment guide](../engineering/deployment.md) for the relevant hosted environment. Current directories are `apps/api`, `apps/web`, `apps/word-addin`, `apps/desktop` and `infra`; installation uses one root npm lockfile.

Before inviting users, verify the configured application URL, auth callback origins, email delivery, database schema/migrations, storage reachability and processing dependencies. Local Compose captures auth email in Mailpit. Keep confirmation enabled where other people can access the instance; invitations and shares depend on verified identity.

Use environment templates as a list of required settings, not production secrets. Preserve existing `.env` files when updating a checkout. Never place service-role credentials or signing/encryption secrets in browser configuration, documentation examples or support screenshots.

## Configuration inventory

| Setting family | Purpose | Operator checks |
|---|---|---|
| `FRONTEND_URL` and auth callback configuration | Trusted application origins and account flows | Use the intended URL; verify sign-in, confirmation, reset and OAuth separately |
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` | Database/auth access | Keep privileged keys server-side; confirm schema and permission behaviour |
| `DOWNLOAD_SIGNING_SECRET` | Signed download/transfer authorization | Generate a dedicated secret; account for existing links when rotating |
| `USER_API_KEYS_ENCRYPTION_SECRET` and connector encryption settings | Stored credential protection | Preserve access to encrypted records; plan rotation rather than replacing keys casually |
| Storage adapter and `R2_*` settings | Object access and public signed-upload reachability | Match bucket/endpoint/origin settings; do not change an existing bucket name without a data migration plan |
| `WORKERS_MODE`, queue driver and optional `REDIS_URL` | Job execution placement and queue backend | Check the selected job paths; avoid duplicate responsibility between API and standalone worker |
| Provider keys, organization keys and configured models | Available model routes | Confirm endpoint, model capabilities, credentials and organizational selection rules |
| OAuth/connector settings | External consent and tool access | Configure each callback; sign-in consent does not connect data tools automatically |
| Explicit error-reporting DSNs and disable switches | Optional operational reporting | Review destination and filtering before enabling |
| Public Terms, Privacy and support settings | User-facing policy/contact links | Replace `.local` placeholders with the instance's approved destinations |

Exact variables and defaults belong to the [API template](../../apps/api/.env.example), [infrastructure template](../../infra/.env.example), [configured model guide](../engineering/configured-models.md) and [observability guide](../engineering/observability.md). Those references take precedence over an abbreviated inventory.

## Organizations and access

Create/select the organization and manage membership through organization settings. Verify invitations with a confirmed account. Roles apply to organization administration; project, workflow, review and document access still have item-specific rules. Do not promise that proposed legal roles or ethical walls already exist because the organization supports owner/admin/member roles.

Use two synthetic users to check an allowed and a denied operation before pilot use. Include direct API reads, document downloads, searches, background results and exports; hiding a navigation item is not authorization evidence. Phase 4 owns completion of the Matter acceptance suite.

## Models and provider credentials

Users manage personal keys under Bring Your Own Keys; authorized organization administrators manage organization providers in organization settings. Verify behaviour with the organization selected rather than assuming that a working Personal model works there. Do not copy a user's personal credentials into organization settings without a deliberate credential ownership decision.

Use [configured models](../engineering/configured-models.md) for OpenAI-compatible endpoints and [provider configuration](../engineering/direct-provider-models.md) for supported providers and saved selections. Local inference requires the API to reach the selected runtime. A “local” model label does not prove the whole task has zero network egress; connectors, web search and reporting have separate paths.

## Connector administration

Connections belong to a user within the selected workspace. Members consent to their own Google or MCP account access; organization owners cannot automatically use another member's connections. Configure service OAuth callbacks before asking users to connect. A Google sign-in connection does not grant Drive/Gmail/Calendar access.

Review enabled tools, scopes, read-only controls and approval settings per connection. MCP writes can be configured with or without approval. When approval is required, the supported chat surface presents the stored proposed action; Word and Tabular Reviews cannot show that approval interface. Google Drive, Gmail and Calendar also support direct writes when approval is disabled. Enable **Ask for permission for write actions** on each connection that requires review; OAuth write consent alone does not enable this safeguard. Recheck the permitted behaviour after a connector/account/tool change.

See [connectors](../engineering/connectors.md) and [Google Workspace](../engineering/google-workspace.md). CourtListener is optional US case-law tooling; it is not Canadian source coverage or the planned CiteCheck acceptance result.

## Workers and document operations

A standalone worker runs API-owned services. When it owns background processing, set the API's `WORKERS_MODE=none` and follow the [worker guide](../../apps/worker/README.md). Queue backend selection and asynchronous conversion/extraction flags change operating requirements; inspect the configuration rather than assuming all work uses Redis.

Distinguish a completed upload from processed document bytes and published searchable text. Inspect document/job outcomes when content is missing; do not repeatedly re-upload or mutate database rows to conceal a processing failure. Follow the [text extraction/recovery guide](../engineering/document-text-search.md) and [troubleshooting](../engineering/troubleshooting.md). Source/version changes and deletion can invalidate derived work.

## Offboarding and recovery

Preview the operation before removing a member or deleting an account. Existing rules retain items with remaining owners, transfer eligible shared work, and archive private ownerless work for the documented recovery period. Account deletion applies organization rules before personal account cleanup; an organization does not acquire the person's Personal workspace.

Only owners manage departed-member archives. Ordinary administrators cannot use an offboarding preview to inspect private titles. The last owner must appoint another owner or explicitly delete the organization. A departed user's organization connections are removed; their Personal connections remain separate.

Use the [offboarding runbook](../engineering/organization-offboarding.md) for the current retention period, transactions, audit events and recovery permissions. These rules do not establish a configurable legal-hold system or comprehensive firm retention policy.

## Audit, integrity and incidents

Use organization audit and personal activity surfaces according to the operation and actor. Operational error reporting is separately configurable. Record the request identifier and safe error summary when investigating a failure; keep document text, credentials and personal data out of diagnostic attachments.

For exported document versions, compare bytes with the manifest hash and verify an optional signature only when configured. Missing hashes remain unverifiable. Integrity checks do not certify legal accuracy or the planned reviewer-approval lifecycle. See [tamper-evident exports](../engineering/tamper-evident-exports.md).

Backup, restore, deletion and incident response require evidence for the actual database, storage and configuration. A passing build or local login does not prove those procedures. Use [deployment operations](../engineering/deployment.md), [observability](../engineering/observability.md) and the [security overview](security.md).

## Pilot readiness record

Before pilot acceptance, record the instance/revision, configured services, synthetic fixtures, allowed and denied journeys, job/retry/revocation outcomes, known limits and responsible reviewers. Confirm Word/desktop scope explicitly; Word is currently Personal-only, and signed desktop distribution requires platform validation. The [CI inventory](../07-implementation/NorthWrit-CI-Inventory.md) distinguishes automated repository gates from the live workflow and operational checks still required.
