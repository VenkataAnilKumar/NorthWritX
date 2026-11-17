# Harvey to NorthWrit: current implementation map

Reviewed November 16, 2026. This maps Harvey's publicly documented product surface to NorthWrit's implemented baseline and remaining work. It supplements the [requirements comparison](Northwrit_vs_Harvey_Feature-Comparison.md), which compares proposed NorthWrit requirements rather than shipped functionality.

## Scope and status

“All” here means the public product families inspected and the additional facets in the [Harvey feature inventory](Harvey_Product-Feature-Inventory.md). It cannot include private tenant features or establish commercial availability. Vendor product statements were inspected, not independently executed. **C** identifies the product pages rechecked for this map; **H** identifies the earlier help/release-note inventory, whose detailed claims were not freshly revalidated. Historical roadmap entries are not treated as shipped.

NorthWrit status:

- **D — Demonstrated building block:** the named NorthWrit operation was exercised with synthetic data. This is not feature parity or a production acceptance claim.
- **B — Source-supported building block:** implementation/guides exist, but the equivalent end-to-end legal journey has not been accepted. Model and connector features depend on configuration.
- **G — Gap:** no equivalent product capability or assurance has been established by the reviewed baseline. This does not assert that no related code exists.

NorthWrit evidence: the [product catalogue](../02-product/NorthWrit-Product-Catalogue.md), [capability matrix](../04-specs/NorthWrit-Capability-Matrix.md), [demo](../guides/demo.md), [current architecture](../06-technical/NorthWrit-Current-Implementation.md), and [floating workspace verification](../07-implementation/NorthWrit-Floating-Glass-Plan.md). Application/UI updates through merge `38da785` do not establish full legal Matter acceptance. **Live AI execution remains unverified because the demo has no model configured.**

Phase references indicate where work fits the existing plan; “extension” means a proposal needing scope and acceptance approval. This research changes neither the roadmap nor application code.

## NorthWrit navigation names

Use the [approved feature navigation](../05-design/NorthWrit-Feature-Navigation.md): **Assistant · Matters · Library · Workflows · Agents**. Agents is a separate proposed main tab. **Contract Intelligence** is the approved proposed section under Workflows; do not label it Contract Review in the target navigation. The feature statuses below remain unchanged by these naming decisions.

## 1. Assistant, threads and legal work

Evidence: [Agents](https://www.harvey.ai/platform/agents), [Vault](https://www.harvey.ai/platform/vault) (C); inventory section 1 (H).

| Harvey feature | NorthWrit mapping/status | Remaining work / suggested placement |
| --- | --- | --- |
| Legal questions, summaries and drafting | **B:** Assistant with model selection and saved conversations | Execute and evaluate source-grounded legal tasks; verify model configuration first |
| Citations and source inspection | **B:** cited answer/review surfaces; **D:** document preview | Validate exact passage/version links; Phase 5 evidence and CiteCheck |
| Persistent threads/history | **B:** saved web conversations and matter conversations | Verify continuity, permissions and exports; Phase 4 |
| Source recommendations and multiple work products in a thread (H) | **G:** no equivalent unified artifact/thread experience established | Design context selection and versioned deliverables; Phase 4/5 |
| Proofreading, translations, email drafts and batch Office edits (H) | **B:** drafting/editing tools; prompt instructions are not accepted task-specific workflows | Separate acceptance cases for each output/client; Phase 5 extensions |
| Prompt library and reusable instructions (H) | **D:** saved Assistant workflow configuration | Add evaluated firm-approved legal workflows; Phase 5 |

## 2. Vault, document collections and Review Tables

Evidence: [Vault](https://www.harvey.ai/platform/vault) (C); inventory sections 3–4 (H).

| Harvey feature | NorthWrit mapping/status | Remaining work / suggested placement |
| --- | --- | --- |
| Organized document collections | **D:** matter/project files and folders, Library | Complete legal matter context and access acceptance; Phase 4 |
| Source document versions | **D:** revised PDF upload, both versions visible, downloaded bytes verified | Carry versions through answers, reviews and approvals; Phase 4/5 |
| Large-scale ingestion and advertised Vault capacity | **B:** upload sessions and processing workers | Establish measured capacity and limits; no equivalent scale claim; Phase 7 |
| Files, email and broad media ingestion (H) | **B:** supported document processing; Gmail connector is a separate capability | Define per-format OCR/media/email support and failures; Phase 6 extension |
| Curated institutional knowledge bases | **B:** Library, templates, playbooks and scoped memory | Build governed precedent curation and retrieval evaluation; Phase 5 |
| DMS-backed collections and synchronization | **B:** Drive/MCP access building blocks | Durable synchronization, deletion/permission propagation and reconciliation; Phase 6 |
| Review tables: document rows/question columns | **D:** tabular workflow setup; **B:** generated cited cells | Execute and evaluate extraction, failure and rerun behavior; Phase 5 |
| Questions over extracted table results | **B:** Tabular Review chat | Verify authorized row/cell scope and evidence; Phase 5 |
| Table instructions, reference files, grouped rows and conditional columns (H) | **B:** workflow instructions/assets; **G:** complete feature bundle not established | Inventory individual behaviors and add justified gaps; Phase 5 extensions |
| Cell reasoning/citations, source preview, inline correction and granular reruns (H) | **B:** review/source interactions | Verify each operation and preserve generated-versus-human edits; Phase 5 |
| Row assignments, flags, cell comments and locks (H) | **G:** no equivalent review-operations bundle established | Collaborative review controls; Phase 5/6 extension |
| Agent-driven bulk table edits and incremental Vault sync (H) | **G:** no accepted equivalent | Governed table tools and synchronization; Phase 6 extension |
| Multi-Vault/Knowledge Base review table (H roadmap) | **G:** not accepted on either side of this mapping | Recheck Harvey release status before prioritizing |

## 3. Knowledge and legal research

Evidence: [Knowledge](https://www.harvey.ai/platform/knowledge) (C); inventory section 5 (H).

| Harvey feature | NorthWrit mapping/status | Remaining work / suggested placement |
| --- | --- | --- |
| Curated legal/regulatory/tax collections and jurisdictional coverage | **B:** optional web search and US CourtListener tools | Verified Canadian sources, coverage and provenance; Phase 5; tax coverage is an extension |
| Web research | **B:** optional Assistant/project web search | Evaluate answers and source selection; not available identically in all clients |
| EDGAR, EUR-Lex and specialist collections | **G:** no dedicated equivalent collection/entitlement established | Separate connector/source decisions; Phase 5/6 extensions |
| Licensed publisher databases | **G:** no equivalent publisher entitlements established | Confirm source rights, APIs and geographic scope before integration |
| Firm knowledge plus public/legal sources | **B:** document context, Library and connectors | Permission-aware retrieval, evidence continuity and evaluation; Phase 4/5 |
| Deep research/planning modes (H) | **B:** tools/subagents; not an accepted legal research product | Evaluated planning, progress, evidence and failure handling; Phase 5/6 |
| Licensed US Shepard's treatment indicators (H) | **G:** CourtListener tools do not establish a licensed citator | Separate legal-treatment source/entitlement from passage verification |
| Canadian research assurance | **G:** planned Bearings and four-state CiteCheck | Phase 5. Harvey's Canadian source-by-source/citator coverage is also unverified here |

## 4. Agents and Memory

Evidence: [Agents](https://www.harvey.ai/platform/agents), [Memory](https://www.harvey.ai/platform/memory) (C); inventory section 2 (H).

| Harvey feature | NorthWrit mapping/status | Remaining work / suggested placement |
| --- | --- | --- |
| Custom Agent Builder and firm instructions | **D:** saved Assistant/tabular workflows; **B:** execution/tools | Governed agent definitions, evaluation and rollout; Phase 6 |
| Delegated and parallel execution | **B:** subagent and execution building blocks | Task budgets, authorization and recovery acceptance; Phase 6 |
| Background work and scheduled agents | **B:** server-owned runs and queues; **G:** accepted user-scheduled agent product | Durable schedules, visibility, cancellation and recovery; Phase 6 |
| Review a plan before execution | **B:** selected tool/write approval surfaces | Distinct plan approval and action approval; Phase 5/6 |
| Mid-run questions/nudges | **B:** interactive tool/approval paths | Defined clarification and escalation contracts; Phase 6 |
| Logged steps and cited work product | **B:** diagnostics/audit and citation building blocks | User-visible execution record tied to evidence and outputs; Phase 5/6 |
| Multimodal input and reports/presentations/interactive outputs | **B:** format/model-dependent document tools | Separate media and output-format acceptance; extension, not presumed parity |
| Personal preference memory | **B:** editable optional user/workspace Markdown memory | Verify preference behavior and isolation; memory is not authority or permission |
| Memory applied across every surface | **B:** web/project and Word memory have client/scope limits | Verify each client; no universal context-sharing claim |
| User memory review/edit/delete and admin controls | **B:** memory/settings lifecycle controls | Confirm retention, disable behavior and organization policy; Phase 5/7 |
| Domain-specific model training (H) | **G:** provider choice/BYOK is not model training | Only consider a separately justified, governed future program |

## 5. Spaces and Legal Work Orchestration

Evidence: [Spaces](https://www.harvey.ai/platform/spaces), [Legal Work Orchestration](https://www.harvey.ai/platform/legal-work-orchestration) (C).

| Harvey feature | NorthWrit mapping/status | Remaining work / suggested placement |
| --- | --- | --- |
| Matter-oriented shared context | **B:** Personal/organization workspaces and project-backed Matters | Matter metadata, overview and two-user/two-matter acceptance; Phase 4 |
| Shared collections, work products and reusable workflows | **B:** item sharing and workflow assets | Cohesive matter-bound work-product lifecycle; Phase 4/5 |
| Client/outside-counsel guest workspaces | **G:** basic sharing is not a guest-delivery product | Guest identity, cross-organization consent and revocation; Phase 6 extension |
| Client self-service workflows/playbooks | **G:** no accepted external self-service portal | Authorized workflow delivery and output review; later pilot-driven extension |
| Resource permissions and bilateral sharing approval | **B:** item roles/access checks; **G:** bilateral organization approval not established | Phase 4 access model plus Phase 6 external collaboration extension |
| Synced ethical walls, including Intapp | **G:** organization membership is not ethical-wall enforcement | Phase 4 isolation foundation; external wall synchronization is Phase 6 extension |
| Spaces activity analytics | **B:** audit surfaces; **G:** Space adoption analytics product | Privacy-aware usage analytics; extension |
| Repeatable Space/matter templates and tasks | **B:** reusable AI workflows; **G:** matter task templates | Matter structure first; task/orchestration extension |
| Assign work to people, clients and agents | **G:** no accepted shared legal task board | Explicit assignees, ownership, due dates and reviewer handoffs; Phase 6 extension |
| Comments, mentions and notifications | **B:** existing run/activity states; **G:** complete task collaboration hub | Event model, subscriptions and access controls; extension |
| Update tasks from email | **G:** Gmail access does not supply this product | Approved external updates with audit/recovery; Phase 6 extension |

## 6. Contract Intelligence

Evidence: [Contract Intelligence](https://www.harvey.ai/platform/contract-intelligence) (C); inventory section 7 (H).

| Harvey feature | NorthWrit mapping/status | Remaining work / suggested placement |
| --- | --- | --- |
| Playbook rules, positions and fallbacks | **B:** manually authored/imported contract playbooks | Execute compilation/review and evaluate legal output; Phase 5 |
| Cited deviations and proposed redlines | **B:** playbook review and document/Word editing | Verify source support, suggested changes and lawyer review; Phase 5 |
| Connected intake and automatic contract classification | **G:** upload and workflow creation are not intake automation | Channel intake, routing and classification; Phase 6 extension |
| First-pass contract review agents | **B:** workflow/playbook execution building blocks | Governed setup, context, escalation and result review; Phase 5/6 |
| Contract queues, status, assignees and due dates | **G:** no equivalent contract operations console established | Contract-specific orchestration; extension |
| Multi-turn negotiation history | **D:** document versions; **G:** negotiation intelligence product | Compare rounds and preserve positions/context; Phase 5 extension |
| Executed-clause precedent benchmarking | **G:** no evaluated clause-benchmarking product | Curated clause corpus, provenance and comparison; Phase 5 extension |
| Recommendations to update playbooks/agents | **G:** no equivalent feedback loop established | Human-approved playbook version lifecycle; extension |
| Portfolio risk, obligations, renewals and notice periods | **B:** possible extraction inputs; **G:** operational product | Evaluated extraction plus confirmed dates, owners and reminders; Phase 6 extension |
| Contract leadership reporting/turnaround metrics | **G:** no accepted portfolio reporting product | Event definitions, permissions and measured metrics; extension |

## 7. Horizon Scanning, Intake, Facts & Chronologies

Evidence: [Horizon Scanning](https://www.harvey.ai/platform/horizon-scanning), [Intake](https://www.harvey.ai/platform/intake), [Facts & Chronologies](https://www.harvey.ai/platform/facts-and-chronologies) (C).

Harvey's Intake page currently offers “Join the waitlist”; Facts & Chronologies offers “Request Early Access.” These are advertised products, not proof of general availability.

| Harvey feature | NorthWrit mapping/status | Remaining work / suggested placement |
| --- | --- | --- |
| Plain-language regulatory scans and source selection | **G:** web search is not continuous regulatory monitoring | Canadian-first source coverage and scan definitions; Phase 5/6 extension |
| Updated coverage, relevance filters and weekly digests | **G:** no accepted monitoring/digest product | Collection freshness, deduplication, triage and provenance; extension |
| Email alerts and shared scans | **G:** no accepted equivalent | Authorized subscriptions and sharing; Phase 6 extension |
| Turn a development into a memo/policy update | **B:** drafting building blocks; **G:** monitored alert-to-action journey | Source/version-linked change assessment and approval; extension |
| Multi-channel legal intake and attachments | **G:** no accepted legal intake product | Intake schema, consent and supported channel integrations; Phase 6 extension |
| Guest request status and same-channel updates | **G:** no equivalent established | Guest lifecycle, secure responses and revocation; extension |
| Rules-based routing, team queues and agent first pass | **G:** no accepted triage/queue product | Owners, routing policy, escalation and reviewed response; extension |
| Contract Intelligence handoff and request audit | **B:** separate audit/workflow components; **G:** complete intake handoff | Cross-domain workflow and auditable state transitions; extension |
| Connected factual record and chronology | **G:** matter memory is not an evidence-linked fact graph | Source-backed facts, dates, entities and conflicting evidence; Phase 5 extension |
| Chronologies, witness outlines, memos and briefs | **B:** generic drafting; **G:** accepted factual-record workflow | Evaluated litigation workflow and source links; extension |
| Dynamic facts and stale-work warnings (H detail) | **G:** no equivalent accepted product | Source changes, dependent outputs and reviewer notification; Phase 5 extension |

## 8. Connector Library, Ecosystem and developer access

Evidence: [Connector Library](https://www.harvey.ai/platform/connector-library), [Ecosystem](https://www.harvey.ai/platform/ecosystem) (C); inventory sections 10–11 (H).

| Harvey feature | NorthWrit mapping/status | Remaining work / suggested placement |
| --- | --- | --- |
| Word chat, proofreading, editing and tracked changes | **B:** Word task pane and tracked-edit review | Real Office-host/model acceptance; Phase 7 |
| Word access to Vault/DMS and unified history | **G:** NorthWrit Word is currently Personal-only with separate conversations | Organization/matter context and cross-client history; extension |
| Outlook add-in and email assistant | **G:** Gmail connector is not an Outlook client or email-in agent | Dedicated clients, consent and reply/draft review; Phase 6 extension |
| Native iOS/Android, scanning and dictation | **G:** responsive web/Electron do not establish native mobile apps | Native mobile/media program only if pilot demand justifies it |
| Teams/Copilot and other embedded surfaces (H detail) | **G:** no equivalent established | Explicit enterprise integration/client work; extension |
| Google Drive documents | **B:** Drive connector | Verify scopes and selected operations; synchronization is separate |
| iManage, NetDocuments, SharePoint/OneDrive and Box | **G:** generic MCP does not establish vendor-specific integration parity | Select DMS adapters with explicit operation/permission tests; Phase 6 |
| Slack, Docusign, Everlaw and Datasite | **G:** no validated native equivalent established | Evaluate individual connectors and outbound actions; extension |
| Additional specialist connectors (H) | **G:** no assumed equivalent for PacerPro, Ansarada, Ironclad, Octus or iTimekeep | Confirm source availability and prioritize by pilot demand |
| Custom MCP connections | **B:** configurable MCP clients/tool access | Harden matter scope, secret lifecycle, approvals and revocation; Phase 6 |
| Curated connector catalogue and admin enablement | **B:** connector settings; **G:** equivalent reviewed marketplace not established | Connector certification/process and organization policy; Phase 6 extension |
| Per-tool confirmation/permissions | **B:** configurable write approval for MCP and Google connectors | Verify configuration-specific behavior; not every permitted write requires approval |
| Hosted MCP service and external REST developer platform (H) | **B:** internal HTTP API is not a supported external integration product | Published authentication, scope, quotas and lifecycle contracts; extension |

## 9. Command Center, Library and enterprise assurance

Evidence: [Command Center](https://www.harvey.ai/platform/command-center), [Security](https://www.harvey.ai/security) (C); inventory section 12 (H).

| Harvey feature | NorthWrit mapping/status | Remaining work / suggested placement |
| --- | --- | --- |
| Central library/history/resource templates (H) | **D:** workflow configuration/library views; **B:** saved history | Firm-level curation, rollout and approved content; Phase 5 |
| Bulk prompt import and content governance (H) | **G:** no accepted equivalent bundle | Catalogue lifecycle and reviewed updates; extension |
| Adoption dashboards by feature/user/team/region | **B:** audit/activity records; **G:** product analytics suite | Define privacy-preserving events, metrics and access; extension |
| SCIM profile synchronization | **G:** organization membership does not establish SCIM | Provisioning/deprovisioning contract and integration; extension |
| Peer benchmarking and ROI analytics | **G:** no comparable data or accepted product | Only with lawful, meaningful measurement and participant consent |
| Ask analytics questions and create reports/dashboards | **G:** no governed analytics agent established | Authorized analytics dataset and evaluated reporting; extension |
| Feature recommendations/access rollout controls | **B:** roles/settings; **G:** Command Center product | Organization capability policy and rollout; extension |
| SAML SSO, audit and data lifecycle controls | **B:** auth/configuration, audit, privacy and offboarding surfaces | Instance-specific enterprise acceptance; Phase 7 |
| IP allow-listing and managed enterprise perimeter | **G:** no equivalent deployment assurance established | Deployment/policy controls and tests; Phase 7 extension |
| Residency, encryption and no-training commitments | **G:** configurable infrastructure/provider keys do not establish contractual assurance | Verify selected deployments, processors and contracts; Phase 5/7 |
| Published certifications and independent audits | **G:** no equivalent NorthWrit certification evidence | Separate assurance program; never infer it from CI or architecture |

## NorthWrit delivery priorities

1. Configure a demo model and validate current Assistant, cited extraction, playbook and Word paths before adding more AI surfaces.
2. Phase 4: complete matter identity, authorized context and access acceptance across sources, conversations, reviews and exports.
3. Phase 5: one evaluated review/draft journey with exact evidence/version links, Canadian research, CiteCheck, Shield and Folio approval.
4. Phase 6: governed agents and selected integrations; promote intake, orchestration or guest collaboration only through explicit scope decisions.
5. Phase 7: validate capacity, recovery, real clients and deployment/processor assurances. Native mobile, portfolio analytics and peer benchmarks remain proposed extensions.

A complete journey is a stronger acceptance target than a percentage of matching labels. No feature-parity score is calculated: rows vary in scope, and a demonstrated upload is not equivalent to a production-scale Vault.
