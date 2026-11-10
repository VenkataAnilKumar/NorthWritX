# Northwrit workflow contracts

Status: Proposed requirements reconciliation. Updated November 9, 2026.

These contracts supplement the [Feature Specification](Northwrit_Feature-Spec.md), [User Journeys](Northwrit_User-Journeys.md), and [User Stories](Northwrit_User-Stories.md). The baseline feature IDs and P0/P1/P2 priorities govern release scope. Architectural approval records a design decision; implementation status requires release evidence.

## Review, evidence changes, and export

SO03–SO05 apply on every surface. A substantive content edit creates a new immutable artifact version in `draft`. An evidence change affecting a cited dependency records `invalidated_evidence` against the affected version and sets its review state to `in_review`. Preserve its original content, evidence snapshot, and historical approval event. Unrelated uploads do not invalidate approval. Refreshing content or citations creates a new version requiring approval.

Export requires current access to the artifact and included evidence. Users with export permission may export unapproved work for internal review, prominently labelled “DRAFT — NOT APPROVED”. The export records version, current review state, evidence status, scope, and citation limitations. An approved export additionally records reviewer and approval time. Approval invalidation prevents the affected version from being exported as currently approved. Previously downloaded files remain immutable; the application displays the invalidation in history.

Recheck authorization, review state, and evidence revision when finalizing an export. A concurrent change fails the approved export with `409 approval_stale`; the user can refresh and request a draft export. External delivery or sharing requires current approval of that version and an AG03 checkpoint bound to recipient, destination, version, and payload hash. A changed payload or recipient requires new approval.

Acceptance: edit approved content, replace cited evidence, upload unrelated evidence, and revoke evidence access. Verify the appropriate state transition, preserved history, draft marking, and blocked stale approved export. Retry an approved external delivery without duplicating it.

## Contract negotiation and Word handoff — P1

DR01–DR05 and RV02: select a versioned agreement and playbook, run clause review, inspect cited deviations, approve proposed edits, and save a new agreement version. Import each counterparty round as a new version. Compare it to the prior round and rerun affected rules. Pin the playbook version in every run; a new playbook produces an explicit rerun offer.

Word and web edits use the same artifact version and concurrency token. On conflict, preserve both drafts and ask the user to compare and resolve them. Recheck document access and approval before export or delivery.

Acceptance: two concurrent edits preserve both drafts; a changed playbook cannot silently change an existing review; a counterparty round requires a new approval.

## Bulk review — P1

RV03–RV05 and SO06: select authorized document versions, define extraction questions, generate cited cells, inspect source passages, correct findings, review the table, and export Excel. Show per-document parsing failures and unresolved cells. Rerun failed rows without overwriting reviewed results silently. A changed source marks dependent cells stale and invalidates the affected approved artifact.

Acceptance: one failed file leaves other rows usable; retry targets failed work; source replacement flags affected cells; export carries table version and review state.

## Firm knowledge publication — P1

RV06, DR02, CN03, CU03: sanitize matter-derived material, obtain explicit approval for promotion into firm knowledge, assign owner and version, then publish to an authorized audience. New versions are published explicitly. Deprecation prevents selection for new runs while preserving authorized historical provenance. Revocation immediately prevents further retrieval. Existing outputs retain history and visibly identify withdrawn dependencies requiring review.

Acceptance: private facts never enter a Pack through automatic memory promotion; an update preserves prior run references; revoked material is inaccessible on a new retrieval. Signed installation and rollback controls remain CN06 at P2.

## Intake through closure — P1

AG08 and MT06: capture request and access scope, classify, assign an owner and matter, draft acknowledgment, confirm task budget, execute, review, deliver through AG03, record completion, and close the request. An unassigned, overdue, rejected, or budget-blocked request enters an escalation queue with a named responsible user. Reopening preserves the original request and delivery history.

Acceptance: no outbound acknowledgment precedes payload approval; an exceeded budget pauses work visibly; closure records owner, deliverable version, and delivery outcome.

## Matter lifecycle and guest access — P1/P2

MT01, MT07, SA05, SA11: closing a matter disables new scheduled work and connector imports, records closure, and applies configured retention. Reopening rechecks policy and membership. Revoking a member or guest blocks subsequent reads, exports, scheduled runs, and deliveries. Queued work rechecks access before execution.

MT08 legal hold is P2. A hold suspends deletion of covered content, versions, and evidence until an authorized release is recorded. While a hold is active, closure and ordinary retention expiry cannot purge protected records. Earlier releases must route preservation requirements to an administrator and disclose the unsupported hold workflow.

Acceptance: revoked guests cannot reuse a shared link; queued delivery fails after revocation; closed matters stop schedules; held records survive an expiry job.

## Scheduled agents and connector changes — P1/P2

AG06, CN02, CN04, AG12: pin workflow version and intended scope at scheduling, then re-evaluate current actor permissions, source permissions, policy, and budget at each run and before each external action. Pause on revoked credentials, denied access, or unavailable required sources. Notify the owner with the failed step and retry options. Use the existing run and step idempotency contract for retries. General event triggers and connector-directory permission sync remain P2.

Acceptance: revocation between retrieval and delivery prevents delivery; retry does not repeat successful writes; partial completion and missed runs remain visible.

## Local and offline work — P1/P2

SH05 provides a validated local task subset at P1. Full offline editing and reconnect synchronization are SH08 at P2. Local Only permits no external calls, including live legal searches and synchronization. Public research requires an explicitly selected permitted processing mode.

On reconnection, authenticate and retrieve current policy before any permitted content upload. Check membership, source rights, and version conflicts. Preserve divergent local and server drafts, show a comparison, and require explicit resolution. Merged content creates a new unapproved version. A revoked user cannot sync content or publish an offline approval.

Acceptance: Local Only produces no external search or sync traffic; reconnect with revoked rights blocks upload; simultaneous edits preserve both copies and require review.

## Scope additions awaiting feature assignment

Later architecture mentions mobile optical scanning, Bates stamping, UTBMS/LEDES billing, biometric approval, and expanded sovereign agents. These remain proposed extensions until assigned feature IDs, acceptance criteria, release phases, and dependencies. Mobile approval inherits SO03 and AG03; biometric unlock alone cannot authorize a stale version. Citator-based mobile alerts depend on RS10 and licensed coverage.

P0 is the research-to-memo pilot in Canadian-region cloud. P1 introduces validated local inference and Firm Server deployment. P2 introduces full offline use and mobile. A pilot offering later-phase features must list its additional validated scope explicitly.
