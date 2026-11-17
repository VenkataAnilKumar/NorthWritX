# NorthWrit cross-platform feature backlog

Reviewed November 16, 2026. This makes the Harvey, Filevine/LOIS and Clio feature discussions explicit in the delivery plan. It is a candidate backlog, not a claim that the capabilities are implemented or that all extensions are approved for the pilot.

## Relationship to existing requirements

Many discussed features already have an allocation in the [105-feature disposition](NorthWrit-Feature-Disposition.md). They do not need to be added again under a new name. Broader industry products often exceed those requirements: a basic timeline is not a litigation fact graph, and a shared matter room is not a complete client portal.

References CF01–CF32 below are discussion/candidate references only, not new specification IDs. **Existing** means an allocation already exists; it does not mean the feature is delivered. **Extension** means separate scope and acceptance are needed. **Deferred** retains the current after-pilot disposition. P1/P2 items require explicit inclusion; none is silently promoted into the pilot by this table.

Benchmark names identify the reviewed functional pattern, not feature parity or a verified vendor menu. Sources and availability boundaries are in the [Harvey implementation map](../03-market/NorthWrit-Harvey-Implementation-Map.md) and [three-platform comparison](../03-market/NorthWrit-Harvey-Filevine-Clio-Comparison.md). Harvey Intake was waitlisted and Facts & Chronologies early access in the reviewed pages. No counterpart to a standalone agent builder was verified for Clio.

## Feature-to-phase mapping

| Ref | NorthWrit feature | Benchmark | Requirement relationship | Placement / decision |
| --- | --- | --- | --- | --- |
| CF01 | Matter-aware Assistant | Harvey, Filevine | Existing AS01–AS03, MT01–MT02 | Phase 4 context/access; Phase 5 legal quality; live AI acceptance pending configuration |
| CF02 | Matter Overview and team context | Filevine, Clio, Harvey Spaces | Existing MT01, MT06 | Phase 4; MT06 P1 inclusion explicit |
| CF03 | Documents, versions and traceable source preview | Harvey Vault, Filevine/Clio documents | Existing RV01–RV02 | Phase 4 source journey, with evidence/approval continuity in Phase 5 |
| CF04 | Scoped client rooms and collaboration | Harvey Spaces, Clio | Existing MT07, SA11; full guest portal is an extension | Selected Phase 4 basic room/wall requirements; richer external guest delivery separately scoped |
| CF05 | Review Grid and bulk extraction | Harvey Review Tables | Existing RV03 | Selected Phase 5; source-backed cells and visible processing failures |
| CF06 | Collaborative review assignments/comments/locks | Harvey Review Tables | Extension beyond the accepted basic review grid | Phase 5/6 candidate; define per-cell history and permissions before selection |
| CF07 | Contract Intelligence: playbooks and redlines | Harvey, LOIS contract work | Existing DR02–DR04; approved section name | Selected Phase 5 contract workflow; broader product features are CF09–CF11 |
| CF08 | Drafting from precedents and firm knowledge | Harvey | Existing RV06, DR01; generalized knowledge-base product is an extension | Selected Phase 5 curation/retrieval/drafting; no unrestricted cross-matter reuse |
| CF09 | Multi-round negotiation comparison | Harvey Contract Intelligence | RV02 provides version foundation; negotiation intelligence is an extension | Phase 5 candidate extension or post-pilot; preserve each round and source position |
| CF10 | Executed-clause benchmarking and portfolio insights | Harvey Contract Intelligence | Existing RV07 deferred; expanded analytics is an extension | After pilot; do not promote portfolio work into Phase 5 by its section name |
| CF11 | Obligations, renewals and key dates | Harvey, Filevine/Clio deadline patterns | AG07 covers selected deadline/digest work; full obligation management is an extension | Selected Phase 6 or after pilot; require confirmed dates, owners and source evidence |
| CF12 | Canadian research and matter-linked memos | Harvey Knowledge, LOIS, Clio research | Existing RS01–RS04, RS06–RS07 | Phase 5 permitted sources, jurisdiction/provenance and evaluated legal work |
| CF13 | CiteCheck and source verification | Harvey/LOIS cited research | Existing RS05; RS10 authority treatment is deferred | Phase 5 claim-support states; do not imply licensed citator coverage |
| CF14 | Beacon regulatory monitoring and digests | Harvey Horizon Scanning | Existing RS08 and RS11 deferred | After pilot unless explicitly re-scoped; web search is not monitoring |
| CF15 | Fact sheet and source-backed timeline | Harvey factual-record patterns | Existing MT04 in 4 and SO09 in 5, both P1 | Select basic factual context/timeline explicitly; full graph is CF16 |
| CF16 | Litigation fact graph, witnesses and changing factual record | Harvey Facts & Chronologies | Extension beyond MT04/SO09 | Phase 5 candidate extension or post-pilot, with a separate evidence-change contract |
| CF17 | Matter tasks, assignees and reviewer handoffs | Harvey orchestration, Filevine, Clio | MT05–MT06 provide context; full task orchestration is an extension | Phase 6 candidate or after pilot; define task/run ownership and notifications |
| CF18 | Agent runs, checkpoints and execution trail | Harvey, Filevine LOIS | Existing AG01–AG03, all P0 | Phase 6 governed run contract; existing subagents are not acceptance |
| CF19 | Agent Library and separate Agents destination | Harvey Agents, Filevine LOIS | Existing AG04; approved navigation name | Phase 6 functional entry; enable only accepted sections |
| CF20 | Agent Studio/custom agent definitions | Harvey Agent Builder, Filevine Skills | Existing AG05 P1; AG09 P2 for versions/cloning | Selected Phase 6; a studio is not required to satisfy the P0 run contract |
| CF21 | Schedules, triggers and recurring work | Harvey Agents, Filevine Routines | Existing AG06 P1, AG12 P2 | Selected Phase 6; scope/revocation/time-zone/retry acceptance required |
| CF22 | Visual Flow Builder | Harvey/Filevine workflow patterns | Existing AG14 deferred | After pilot; process automation does not require a visual builder initially |
| CF23 | Requests: intake, routing and triage | Harvey Intake, Filevine, Clio | Existing AG08 P1; AG13 P2 for business self-service | Selected Phase 6 minimum; full guest/multi-channel portal needs extension scope |
| CF24 | Email/calendar and matter communication workflows | Harvey Ecosystem, Filevine, Clio | CN02/CN04 integration foundations; DR06 Outlook deferred | Selected Phase 6 connector operations; Outlook client/email-in agent is not implied |
| CF25 | DMS integration and permission synchronization | Harvey Connector Library | Existing CN02, CN04–CN05 | Selected Phase 6 adapters; native vendor parity needs per-operation evidence |
| CF26 | Word legal drafting/review | Harvey Word, LOIS Word | Existing DR05 P1 | Selected Phase 6 plus real-host acceptance; current Personal/history limits remain until changed |
| CF27 | Firm Packs, reusable expertise and content governance | Harvey workflows/playbooks; LOIS Skills | Existing AS04–AS06, CN03, CN06, CU04 | Selected Phase 6 packaging/governance; Phase 5 can prepare initial legal content |
| CF28 | Insights and adoption dashboards | Harvey Command Center; Filevine/Clio reporting | Existing SA14 deferred; peer/ROI benchmarking is an extension | After pilot; define metrics/privacy and avoid unsupported ROI claims |
| CF29 | Full client portal and external request experience | Clio client lifecycle, Harvey Spaces | MT07/AG13 are related; full portal is an extension | After-pilot candidate unless a narrower Phase 6 slice is selected |
| CF30 | Native mobile, scanning and dictation | Harvey Mobile | Existing CU05 and AS07 deferred | After pilot; responsive web/Electron do not establish native mobile acceptance |
| CF31 | Seats, subscriptions and product billing | Clio commercial/practice experience as a benchmark | Existing SA13 deferred | After pilot/commercial-readiness proposal; separate NorthWrit subscriptions from client invoices |
| CF32 | Legal timekeeping, client invoicing and payments | Clio, Filevine | New practice-management extension; not equivalent to SA13 | Prefer selected integrations after pilot demand; no standalone billing product committed |

## Navigation placement

Use [approved feature navigation](../05-design/NorthWrit-Feature-Navigation.md): Assistant, Matters, Library, Workflows and the proposed separate Agents tab. Contract Intelligence belongs under Workflows; reusable Playbooks stay in Library. A matter shows its own related reviews/deliverables; run history and action approvals retain one shared authorized record rather than being copied between tabs.

Requests, Tasks, Facts & Timeline, Firm Knowledge and Insights are visible only when the selected functional slice works. Naming approval does not set capacity, commercial availability, source rights or legal accuracy guarantees.

## Recommended first complete slice

After the Phase 4 foundation, select a source-backed contract journey spanning CF01, CF03, CF05, CF07 and CF08 with Folio/Shield controls:

**Matter → authorized source versions → cited findings → proposed edits → lawyer approval of the exact version → export.**

Evaluate research CF12/CF13 with permitted Canadian sources as a separate but connected legal slice. Then select governed execution CF18 and one valuable connector CF25. Do not expand into all vendor products before these journeys are accepted.

## Gate to promote a candidate into implementation

Record a user problem and success measure, exact existing requirement IDs or an explicitly new extension, named owner/reviewer, API/schema/access boundaries, allowed model/source routes, synthetic evaluation fixtures, failure/revocation/rollback cases and an effort estimate. Product scope decisions must update the active plan and affected allocation records together. No candidate changes the 105-feature totals automatically.

The [phased delivery plan](NorthWrit-Phased-Delivery-Plan.md) governs entry/exit evidence; proposed Phases 8–11 are conditional selection windows rather than dates or blanket commitments. Live model evaluation remains pending configuration. This backlog starts no implementation, deployment or publication.
