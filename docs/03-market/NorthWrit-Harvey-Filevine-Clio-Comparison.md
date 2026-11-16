# Harvey, Filevine and Clio: product comparison for NorthWrit

Reviewed November 16, 2026. Status: public-product research and planning input. Findings describe vendor-advertised capabilities, not independently executed product tests. Availability, pricing, legal-source rights, regional coverage and security assurances require product-specific confirmation. This assessment does not change NorthWrit's implementation scope.

## Positioning

Harvey is the closest product benchmark for NorthWrit's legal analysis, document review and drafting direction. Filevine and Clio provide useful benchmarks for connecting legal work to broader firm operations.

All three position AI around connected matter context, source information and work execution. NorthWrit should evaluate individual journeys and acceptance criteria rather than infer capability from a shared product label.

## Product comparison

| Area | Harvey | Filevine / LOIS | Clio |
|---|---|---|---|
| Primary emphasis | Legal analysis, document intelligence and agent-assisted work | Case management with firm-wide AI execution | Legal work connected to intake and practice operations |
| Document review | Vault, structured review tables, cross-document analysis and knowledge bases | Case-document analysis grounded in matter context | Matter-document analysis connected to legal work |
| Legal research | Knowledge connects queries to legal databases, curated sources and firm knowledge | Citation verification, passage grounding and holding-level analysis | Legal authority connected to matter facts and exact cited passages |
| Drafting | Precedents, firm standards, Contract Intelligence and Word integration | Drafting, review and redlining through LOIS and Word | Documents, forms and document sets in Clio or Word |
| Agents and workflows | Parallel/background agents, scheduling, Agent Builder, plan review and logged steps | Firm-wide agents, Routines, Skills and operational actions | Workflows triggered by schedules, requests or matter changes |
| Collaboration | Spaces, shared Vaults and resource-level governance | Case teams and caseload workflows | Matters, clients, teams and operational approvals |
| Firm operations | Expanding into intake and legal-work orchestration | Tasks, deadlines, intake, billing and case phases | Intake, calendars, client updates, billing and payments |

This table summarizes emphasis, not an exhaustive availability checklist. Public positioning does not establish feature parity, equivalent permission controls or identical deployment options.

## Harvey: legal work and document intelligence

- **Vault:** document collections, structured review tables, analysis across documents, and curated knowledge bases for precedents and playbooks.
- **Knowledge:** retrieval across external legal sources and internal institutional knowledge. NorthWrit needs its own source-access agreements and verified Canadian coverage.
- **Agents:** background delegation, parallel work, scheduling, reusable agent instructions, reviewable plans and auditability.
- **Spaces:** shared work context with collaboration and governance.
- **Contract Intelligence:** a focused contract-review and negotiation experience.

Sources: [Harvey](https://www.harvey.ai/), [Vault](https://www.harvey.ai/platform/vault), [Knowledge](https://www.harvey.ai/platform/knowledge), [Agents](https://www.harvey.ai/platform/agents). Spaces and Contract Intelligence are also identified in Harvey's public product navigation: [Spaces](https://www.harvey.ai/platform/spaces), [Contract Intelligence](https://www.harvey.ai/platform/contract-intelligence). This review inspected the home, Vault, Knowledge and Agents pages directly.

## Filevine: case intelligence and operational execution

LOIS presents a connected suite covering legal research, meetings, Outlook, reusable routines, firm Skills, Word and Filevine case context. Its product story moves from answering questions to completing work within a case: creating tasks, handling deadlines, updating fields and preparing documents.

Its research offering distinguishes citation verification, exact supporting passages, opinion-scoped questions and holding-level treatment analysis. Those are different evidence problems. A real citation does not establish that a passage supports a proposition or that its holding remains authoritative.

Filevine advertises a structured legal graph. Public product pages do not establish the underlying database technology or demonstrate that adopting a graph library reproduces the platform's capabilities. Reported productivity improvements remain vendor/customer claims with their own measurement scope.

Sources: [Filevine](https://www.filevine.com/), [LOIS](https://www.filevine.com/lois/), [LOIS Legal Research](https://www.filevine.com/lois/legal-research/).

## Clio: the matter lifecycle and practice operations

Clio's product story connects prospective-client intake, matter creation, legal analysis and drafting with calendars, client updates, billing and payments. Its AI page emphasizes existing matter context, automatic next steps, firm preferences and human sign-offs.

Examples include draft calendar events/tasks from court documents with source text, proposed client communications from matter activity, and draft bills routed for review. These are useful demonstrations of a trigger, prepared work, a review point and an operational outcome.

Regional and plan differences matter. The reviewed US/global page described phone, email and chat intake; the Canadian page described email and chat. The Canadian page described some AI billing/client-update features in Core-or-higher plans and other capabilities in selected plans or add-ons. These descriptions require confirmation for the intended subscription and deployment.

Clio publishes permission, encryption, retention-agreement, activity-log and certification claims. Their scope must be checked against the specific product and trust documentation. Such claims do not transfer to NorthWrit through a similar interface or workflow.

Sources: [Clio Legal AI](https://www.clio.com/features/legal-ai-software/), [Clio Canada Legal AI](https://www.clio.com/en-ca/features/legal-ai-software/). Both pages were inspected directly.

## Implications for NorthWrit

| Priority | Product lesson | NorthWrit application |
|---|---|---|
| Phase 4 — Matter workspace | Connected workspace and source-review experience | Persistent matter context and access across documents, conversations, reviews and outputs |
| Phase 5 — Evidence-backed legal work | Review tables, precedents and explicit evidence grounding | Cited findings, source-version continuity, reviewed drafts and clear unknowns |
| Phase 5 — Citation quality | Separate citation verification, passage support and legal treatment | Implement CiteCheck states without implying unsupported good-law analysis |
| Phase 5 — Approval | Make review decisions durable | Bind approval to the output version, evidence and proposed action |
| Phase 6 — Governed automation | Reviewable agent plans, reusable routines and operational handoffs | Scoped execution, visible progress, revocation, explicit approval where required and recoverable failures |
| Later, when justified by pilot demand | Broader practice operations | Selected intake, calendar, client-communication and billing integrations |

Recommendation: focus on a complete document-to-reviewed-work-product journey before expanding into a broad practice-management suite. Use the existing [implementation plan](../07-implementation/NorthWrit-Implementation-Plan.md), [workflow contracts](../04-specs/Northwrit_Workflow-Contracts.md) and [capability matrix](../04-specs/NorthWrit-Capability-Matrix.md) as delivery authority.

## Demonstration target and current evidence

**Matter → source documents → cited review table → reviewed draft → approval of a specific version → export.**

This is a future demonstration target, not a claim that the full journey is delivered. The [current NorthWrit demo](../guides/demo.md) verifies project/source handling, version creation/download, saved workflow setup and desktop access. It does not demonstrate live AI findings, evaluated drafting quality or version-bound legal approval. Those stages require implementation or configuration and their own acceptance evidence.

Public research and this comparison made no application changes and added no dependency on any vendor platform.
