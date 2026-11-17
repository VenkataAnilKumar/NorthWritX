# Phase 2C — Experience, AI and evidence contracts

Prepared November 16, 2026 on planning baseline `67ac004`. Status: proposed experience and acceptance contract, pending product, legal, design and security review. This consolidates existing requirements; it does not implement an API, establish legal quality, close Phase 2 or start Phase 4. Named reviewers, pilot configuration and live AI verification remain pending.

## Authority and scope

Read with the [Phase 2A scope proposal](NorthWrit-Phase-2A-Pilot-Scope.md), [Phase 2B architecture principles](NorthWrit-Phase-2B-Architecture-Principles.md), [feature specification](../04-specs/Northwrit_Feature-Spec.md), [workflow contracts](../04-specs/Northwrit_Workflow-Contracts.md) and [capability matrix](../04-specs/NorthWrit-Capability-Matrix.md). Existing 105 IDs, priorities and phase allocations remain unchanged. Selected P1/P2 features require explicit inclusion; a target contract here does not select every extension.

The workflow contracts own review/evidence transitions and export rules. State names and `409 approval_stale` below are target requirements, not a claim that current endpoints emit them. Serialized types and detailed schema/API choices belong to their implementation increments.

## Experience and navigation

The [navigation plan](../05-design/NorthWrit-Feature-Navigation.md) and [design system](../engineering/design-system.md) remain authoritative.

| Surface | Current baseline | Target for selected increments |
| --- | --- | --- |
| Primary navigation | Assistant, Matters, Library, Workflows | Add Agents as a separate fifth destination when functional; no placeholder destinations |
| Assistant | General and contextual conversation paths exist | Show active workspace/matter, selected sources, model and processing route; switching context must not silently reuse another matter's evidence |
| Matters | Existing project identity, documents, conversations and reviews | Useful Overview and selected legal metadata in Phase 4; retain project IDs and existing links |
| Library | Reusable file/template/playbook surfaces | Explicit audience, version and publication controls for selected firm knowledge; no automatic promotion of private matter content |
| Workflows | Existing definitions and review execution | Contract Intelligence groups selected contract review/drafting journeys; preserve source and playbook versions |
| Agents | Future navigation | Governed run history and selected approvals; Library/Studio/Schedules only when separately selected and delivered |

Use the existing floating workspace treatment with opaque reading/editing areas. Keyboard focus, accessible names, meaningful loading/error announcements and status text must work without colour alone. Test dark mode, narrow viewports, reduced motion, reduced transparency and forced colours for affected screens. Glass styling must not reduce document readability or conceal scope/approval warnings.

One domain resource keeps its identity across entry points. Opening a run from a matter or Agents must not create duplicate histories. Going back from a source passage restores the reviewed finding and version. Standalone authorized content remains supported; do not force every conversation or Library item into a matter.

## AI execution contract

The [configured-model guide](../engineering/configured-models.md), [connector guide](../engineering/connectors.md) and [backend execution rules](../engineering/backend-architecture.md) describe current capabilities and limits. Provider availability, data-routing permission, source entitlement and tool/action approval are independent checks.

1. Before execution, identify actor, workspace, optional matter, selected authorized source versions, workflow/playbook version where applicable, requested task, permitted route and usage limit. The selected UI workspace is not an authorization grant.
2. Resolve a configured model and current policy before sending content. If the model or credentials are unavailable, show configuration guidance and preserve the user's draft. Never silently substitute another provider, region or processing mode.
3. Recheck resource, tool and source rights when queued work executes and before publication or an external action. Retrieved text and tool results are untrusted content; embedded instructions cannot expand scope or authorize tools.
4. Show progress, partial results, failed steps and the consequences of retry. Completed writes must not repeat on retry. A cancelled, incomplete or failed response cannot be presented as a completed, approved legal deliverable.
5. Preserve the distinction between explicit Stop and a dropped connection. Current streaming runs live in process memory and retain finished replay for 60 seconds; reconnect is not durable recovery after process restart. Specify governed-run checkpoints and recovery in Phase 6 rather than claiming the current stream supplies them.
6. Log safe provenance, policy decisions and outcome metadata. Do not duplicate credentials, signed URLs or sensitive prompt/source bodies into ordinary logs or demo artifacts. Retention/access rules need a selected deployment decision.

Local/cloud model metadata does not prove residency or Local Only isolation. SH05 Local Only is a separately validated P1 subset with no external calls, including search and synchronization. SH08 offline synchronization remains P2. Source rights, Canadian deployment claims and provider retention/training terms require explicit evidence before acceptance or marketing claims.

The current demo has no configured working model. Live AI, legal quality and provider routing acceptance remain deferred; this document does not configure credentials or run inference.

## Evidence and CiteCheck contract

Target evidence references identify the source, immutable version or retained retrieval snapshot, passage/location, retrieval time where applicable and access/provenance context. An external URL alone is insufficient. A changed active version must not redirect an old finding to different text. Snapshot retention must respect source rights; where retention is prohibited, record the reproducibility limit rather than promise a retained copy.

Show transfer, processing/OCR and evidence-readiness states separately. Missing pages, extraction failures, unavailable sources and unsupported claims stay visible. Generated text, user edits, model confidence and hash integrity are distinct from evidence support and lawyer approval.

RS05 defines four claim-support labels. These are target UI meanings subject to the legal evaluation rubric:

| Label | Meaning and required presentation |
| --- | --- |
| Verified | The inspected passage supports the specific claim; show the exact source/passage and verification context |
| Unverified | Support has not been established; resolution of a citation or a plausible answer is insufficient |
| Contradicted | Inspected evidence conflicts with the claim; expose the conflicting passage for review |
| Unavailable | Required source/passage cannot currently be inspected; expose the limitation rather than infer support |

Claim support does not establish binding authority, current good law, completeness or legal advice. Authority-treatment/citator coverage RS10 is separately deferred and depends on licensed sources. Distinguish a withdrawn/stale dependency from the historical support assessment; do not silently relabel an inaccessible citation as verified.

The feature specification's reconciliation table quotes a PRD “at least 99%” aspiration; its reconciled rule is four labels with a support check. Do not treat the quoted figure as achieved quality or an agreed evaluation protocol. Before legal acceptance, reviewers must agree the evaluation set, unit/denominator, false-support/error measures, thresholds and unavailable-source treatment, including Ontario/practice and permitted-source scope. Transport mocks cannot establish legal quality.

## Work-product review and action approval

Apply SO03–SO05 and AG03 from the workflow contracts to selected implementations:

| Event | Required target behaviour |
| --- | --- |
| Substantive edit | Create a new immutable artifact version in `draft`; preserve the old version and approval history |
| Change to a cited dependency | Record `invalidated_evidence` on the affected version and set review state to `in_review`; retain original content/evidence snapshot and historical approval |
| Unrelated upload | Preserve existing approval; do not invalidate artifacts without an affected dependency |
| Refresh content/citations | Create a new version requiring review/approval |
| Permitted internal draft export | Recheck access to artifact and included evidence; prominently mark “DRAFT — NOT APPROVED” and record version, review/evidence status, scope and citation limits |
| Approved export | Recheck current access, review state and evidence revision at finalization; record reviewer/time; concurrent invalidation fails with target `409 approval_stale` |
| External delivery/sharing | Require current approval of the exact version plus an AG03 action checkpoint bound to recipient, destination, version and payload hash; changes require new approval |

Folio work-product approval and agent/connector action approval are separate decisions. A reviewed answer does not authorize sending it; a permitted send does not certify its legal content. Previously downloaded files remain immutable; show later invalidation in application history. Issued signed-link lifetimes and revocation limits remain the Phase 2B/4 security decision.

Current connectors can execute permitted writes directly by default. Optional per-write approval exists for Assistant and project chats; Word and tabular paths refuse writes needing an unavailable approval continuation. This baseline is not acceptance of the stronger target external-delivery gate. Do not weaken existing connector controls or expose a selected legal delivery path until its required checkpoint is implemented and tested.

Contract runs pin agreement and playbook versions; a new playbook offers an explicit rerun. Bulk review exposes per-file/cell failures and retries failed work without silently overwriting reviewed results. Firm knowledge requires explicit sanitized publication and audience/version controls. These inherit their existing P1 selection gates rather than becoming new Phase 2 features.

## Client boundaries and failure experience

Web is the primary experience contract. Electron reuses the web surface, while native packaging/signing and release verification remain separate. Word currently has Personal-context and separate conversation/history limits; shared version/concurrency behaviour is a future selected DR/RV contract, not established cross-client parity.

On a target web/Word edit conflict, retain both drafts and require comparison/resolution. On permitted offline reconnect, authenticate and retrieve current policy before upload, recheck source rights and preserve divergent drafts; merged content creates a new unapproved version. Revoked membership blocks new execution/publication. Closing/archiving a matter must not be described as an implemented legal hold.

## Acceptance scenarios for later increments

These are required fixture candidates for the selected scope, not tests executed in Phase 2C.

| Scenario | Evidence expected | Delivery gate |
| --- | --- | --- |
| Switch between two users/workspaces/matters | No unauthorized retrieval, source carryover, search result or job publication; back links retain authorized version context | 4B–4E |
| Upload succeeds but extraction fails | Distinct processing failure, preserved document, usable retry and no invented evidence | 4C–4E |
| Provider unavailable or route denied | Saved draft, visible failure and no unauthorized fallback or external traffic | 5A; dependent AI acceptance |
| Supported, unsupported, conflicting and inaccessible citations | Four distinct labels with inspectable evidence/limits and lawyer-reviewed results | 5B–5C, 5F |
| Edit output, replace cited source, upload unrelated source | Correct version/review transitions and preserved history without unrelated invalidation | 5C–5E |
| Revoke access or change evidence during export | Finalization denies stale approved export; permitted draft export remains visibly unapproved | 4D access; 5E approval |
| Change recipient/payload or retry external action | New checkpoint where required; no duplicate successful delivery; output approval alone cannot send | 5E, 6A–6C |
| Drop stream, Stop, restart process | Distinct reconnect/cancellation/recovery limits; no claimed durable recovery from in-memory replay | 6A–6B |
| Client conflict or Local Only route | Both drafts preserved; selected client limits visible; Local Only emits no external search/sync calls | Selected Word/local/offline increments |
| Keyboard and visual accessibility | Focus, announcements, legible document content and equivalent status cues across supported modes | Each affected UI increment; 7A |

## Phase 2C decision register

| Ref | Decision / required evidence | State and resolution gate | Responsible review role |
| --- | --- | --- | --- |
| C01 | Preserve four current destinations; add functional Agents and Contract Intelligence under Workflows | Existing navigation authority; test each delivered section | Product/design |
| C02 | Confirm selected journey context, client scope and accessibility acceptance | Proposal; before affected UI increment | Product/design and client engineering |
| C03 | Approve provider/model, permitted data route, usage limit and fallback policy | Configuration and review pending; before dependent AI acceptance | Security/operations and legal |
| C04 | Select source providers, rights, jurisdiction/practice and snapshot retention | Pending; before research acceptance | Legal/source owner |
| C05 | Define evidence reference wire types and dependency invalidation | Target; before 4A/5C contracts respectively | Domain/API and legal |
| C06 | Agree CiteCheck rubric, dataset and numeric measures/thresholds | Pending; before legal evaluation | Legal reviewer and evaluation engineering |
| C07 | Implement exact-version review/export and external-action checkpoints | Target; before selected approval/delivery acceptance | Domain/security and legal |
| C08 | Specify cancellation, retry, idempotency and durable recovery guarantees | Current stream limits recorded; governed-run design before 6A | API/worker engineering |
| C09 | Select audit retention, safe logging and signed-delivery revocation limits | Pending; before affected security/export acceptance | Security/operations |
| C10 | Assign named reviewers and record decisions/remaining limits | Pending; Phase 2D and each increment's entry gate | Product/engineering leads |

## Review and closure

Check links, repository rules, branding and whitespace for this document change. Application, database, accessibility, Office and live-model scenarios above remain future acceptance work. Phase 2C remains in review until required decisions have named reviewers and recorded outcomes. Use the [Phase 2D delivery and verification plan](NorthWrit-Phase-2D-Delivery-Verification-Plan.md) for work-package preparation and evidence gates; do not infer authorization to start Phase 4 implementation from this contract.
