# Feature Specification

> Requirements reconciliation — November 9, 2026. The [Workflow Contracts](Northwrit_Workflow-Contracts.md) govern review invalidation, export eligibility, lifecycle handoffs, and baseline release scope. Architectural approval does not establish implementation status.
## Northwrit: privacy-first legal AI workspace for Canadian law firms and in-house teams

**Version:** 2.0 | **Date:** November 3, 2026 | **Status:** Proposed (nothing is built yet)

---

## Overview

This document lists every Northwrit feature module with its ID, requirement, priority and origin. It is the engineering handoff for the [Product Definition](../02-product/Northwrit_Product-Definition.md). The release plan is in [Mike OSS Implementation Plan](../07-implementation/Northwrit_MikeOSS-Implementation-Plan.md). It consolidates the Northwrit PRD, the feature-names workbook and the Legal SI specification (see [Source reconciliation](#source-reconciliation)).

**Priority:** P0 = required for the first pilot · P1 = extends the validated workflow · P2 = later platform expansion.
**Origin:** B = in both source documents · P = PRD only · S = Legal SI only.

**Rules for every module that calls a model:**
- every call goes through the **Model Gateway** (SH02);
- the call is subject to the matter's **Processing Policy** (SH01) and, from P1, **Smart Routing** (SH06);
- every cloud send is recorded in the **Shield Log** (SH03) and every action in the **Audit Trail** (SA09).

Nothing calls a provider directly.

## Module index

| Module | Prefix | P0 | P1 | P2 | Total |
|---|---|---|---|---|---|
| [Assist](#assist) | AS | 3 | 3 | 1 | 7 |
| [Research](#research) | RS | 6 | 2 | 3 | 11 |
| [Review](#review) | RV | 2 | 4 | 1 | 7 |
| [Draft](#draft) | DR | 0 | 5 | 2 | 7 |
| [Matters](#matters) | MT | 3 | 4 | 1 | 8 |
| [Search and Outputs](#search-and-outputs) | SO | 5 | 4 | 3 | 12 |
| [Agents and Automate](#agents-and-automate) | AG | 3 | 5 | 6 | 14 |
| [Connect and Packs](#connect-and-packs) | CN | 1 | 2 | 5 | 8 |
| [Shield (privacy and routing)](#shield-privacy-and-routing) | SH | 4 | 3 | 1 | 8 |
| [Security and Admin](#security-and-admin) | SA | 9 | 4 | 2 | 15 |
| [Customization](#customization) | CU | 1 | 3 | 3 | 7 |
| [Quality (internal)](#quality-internal) | QA | 1 | 0 | 0 | 1 |
| **Total** | | **38** | **39** | **28** | **105** |

---

## Assist

**Purpose:** Cited conversational help over a matter's documents, under the matter's policy.

| ID | Feature | Requirement | Priority | Origin |
|---|---|---|---|---|
| AS01 | Pinpoint Cites | Every claim drawn from matter documents links to the exact passage, which opens at that spot. | P0 | B |
| AS02 | Model Picker | Users choose among the models their firm allows; each answer shows which model and provider produced it. | P0 | B |
| AS03 | Save to Matter | Any answer or output saves to a matter in one click. | P0 | P |
| AS04 | Prompt Library | Searchable ready-made legal prompts by practice area. | P1 | P |
| AS05 | Specialists | Admin-defined named assistants with set instructions, knowledge and tools. | P1 | B |
| AS06 | My Style | Learns a user’s writing style from uploaded samples and applies it to drafts. | P1 | P |
| AS07 | Dictate | Voice prompts on web, desktop and mobile. | P2 | P |

---

## Research

**Purpose:** Live, scoped legal research where every claim is cited and every citation is checked, with limits shown.

| ID | Feature | Requirement | Priority | Origin |
|---|---|---|---|---|
| RS01 | Answer Engine | Live answers from permitted legal and web sources, with claim-level citations and a source panel. | P0 | B |
| RS02 | Bearings | Before searching, asks for missing jurisdiction, relevant date, side and material facts. Never silently assumes them. | P0 | B |
| RS03 | Source Filters | Filter by jurisdiction, court, date range and source type; coverage limits are always visible. | P0 | B |
| RS04 | Source Labels and Synthesis | Labels each claim as matter document or public source, and separates supporting authority, contrary authority, assumptions, inference and unknowns. | P0 | B |
| RS05 | CiteCheck | Resolves every citation to a source and checks that the passage supports the claim. Labels: Verified, Unverified, Contradicted, Unavailable. Does not imply a citator (good-law) check unless licensed data supports it. | P0 | B |
| RS06 | Research Memo | Editable memo: facts, issues, rule, analysis, authorities, limitations, conclusion, with a table of authorities. | P0 | B |
| RS07 | Deep Research | Planned multi-step research with progress display, interruption and steering. | P1 | S |
| RS08 | Beacon | Alerts on new decisions, regulatory changes or docket activity for a matter. | P1 | B |
| RS09 | Triangulate | Two or three models answer independently; disagreements are highlighted. Used as a diagnostic, not as proof. | P2 | B |
| RS10 | Authority Treatment | Cross-jurisdiction comparison and subsequent-history checks where licensed data supports them. | P2 | S |
| RS11 | Dispatch | Legal news feed filtered by practice area. | P2 | P |

---

## Review

**Purpose:** Turn uploaded documents into searchable, citable passages and answer questions across many documents.

| ID | Feature | Requirement | Priority | Origin |
|---|---|---|---|---|
| RV01 | Smart Upload | PDF and DOCX ingestion with text extraction, indexing and per-document status. Failures name the document and the reason. | P0 | B |
| RV02 | Document Versions | Records versions, source locations and document permissions. | P0 | B |
| RV03 | Review Grid | Questions as columns, documents as rows; every cell has a cited answer; exports to Excel. | P1 | B |
| RV04 | OCR and Email Ingestion | Scanned files, email and attachments, with explicit parsing failures. | P1 | B |
| RV05 | Auto-Sort | Classifies documents by type, extracts structured metadata, detects duplicates. | P1 | B |
| RV06 | Precedent Bank | Approved precedents, templates and knowledge bases with owners and versions. | P1 | B |
| RV07 | Portfolio Compare | Compares a clause across many agreements; extracts obligations and renewal dates. | P2 | B |

---

## Draft

**Purpose:** Draft and review contracts and letters from the firm's own precedents and standard positions.

| ID | Feature | Requirement | Priority | Origin |
|---|---|---|---|---|
| DR01 | Draft from Precedent | Drafts contracts, letters and memos from approved templates and structured inputs. | P1 | B |
| DR02 | Playbooks | The firm’s standard positions and fallback wording, with owners and versions. | P1 | B |
| DR03 | Playbook Check and Redline | Flags clauses that depart from the playbook and proposes tracked changes for lawyer review. | P1 | B |
| DR04 | Redline Report | Compares two versions and produces an issue list. | P1 | P |
| DR05 | Northwrit for Word | Word add-in for Assist, Draft and Playbook Check. | P1 | B |
| DR06 | Northwrit for Outlook | Outlook add-in for summaries, replies and filing to matters. | P2 | B |
| DR07 | Translate | Document translation, English and French first. | P2 | P |

---

## Matters

**Purpose:** The matter is the boundary for data, policy, audit and agent runs.

| ID | Feature | Requirement | Priority | Origin |
|---|---|---|---|---|
| MT01 | Matter Workspace | Files, threads, outputs, members, roles and client/matter number; access controls apply before content is ingested. | P0 | B |
| MT02 | Matter Instructions | Standing guidance applied to every request in the matter. | P0 | P |
| MT03 | Privacy Setting | Each matter carries its processing mode (Local Only, Hybrid or Cloud), jurisdiction and source scope, visible at all times. | P0 | B |
| MT04 | Fact Sheet | Editable matter memory: parties, dates, defined terms and facts, with provenance. | P1 | B |
| MT05 | Matter Templates | Presets by matter type with folders, agents, instructions and checklists. | P1 | B |
| MT06 | Matter Dashboard | Key dates, tasks, activity, agent runs, and request status. | P1 | B |
| MT07 | Client Rooms | Shared spaces with clients and co-counsel as scoped guests. | P1 | B |
| MT08 | Legal Hold | Retention, archiving and legal-hold rules. | P2 | P |

---

## Search and Outputs

**Purpose:** Search everything the user may see, and keep work product as editable, versioned, reviewable folios.

| ID | Feature | Requirement | Priority | Origin |
|---|---|---|---|---|
| SO01 | Northwrit Search | One box across matters, documents, threads, outputs and agents; hybrid keyword and semantic; respects permissions and ethical walls. | P0 | B |
| SO02 | Folios | Editable work products (memos, tables, drafts) open beside the chat; edit directly or by asking. | P0 | B |
| SO03 | Review States | Draft, In review, Changes requested, Approved. Approval belongs to one version; substantive edits or changed evidence invalidate it. | P0 | S |
| SO04 | Folio History | Versions with compare and restore; citations stay linked; reviewer identity and edits preserved. | P0 | B |
| SO05 | Export (DOCX) | Download the reviewed work product with citations, assumptions, scope and selected version. | P0 | B |
| SO06 | Export (PDF, Excel, branding) | Additional formats with firm branding. | P1 | P |
| SO07 | Quick Jump | Ctrl/Cmd+K command palette. | P1 | P |
| SO08 | Conversation Search and Saved Searches | Find past chats and conclusions; save and rerun searches. | P1 | P |
| SO09 | Timelines | Chronologies of events from matter documents. | P1 | P |
| SO10 | Charts and Decks | Charts, flowcharts and slide decks. | P2 | P |
| SO11 | Calculators | Limitation periods, interest and damages. | P2 | P |
| SO12 | Client Brief | A branded page or PDF shared with access controls. | P2 | P |

---

## Agents and Automate

**Purpose:** Bounded, logged, approved multi-step work, then automation.

| ID | Feature | Requirement | Priority | Origin |
|---|---|---|---|---|
| AG01 | Research-to-Memo Workflow | Bounded workflow with persisted steps, cancellation and resumable failures. | P0 | S |
| AG02 | Run Trail | Step-by-step record of each run: tool outcomes, sources, model and provider identity, usage. | P0 | B |
| AG03 | Checkpoints | Lawyer approval before key steps; exact payload approved before any external write. | P0 | B |
| AG04 | Agent Library | Starter agents: NDA Triage, Contract Review, Diligence Report, Lease Abstract, Chronology Builder, Research Memo, Redline Analyzer, Clause Compare, Closing Checklist, Deposition Summary. | P1 | P |
| AG05 | Agent Studio | Describe an agent in plain English; edit steps, input forms and knowledge; test on sample documents before publishing. | P1 | B |
| AG06 | Schedules | Run a prompt, agent or monitor on a schedule with configurable scope. | P1 | B |
| AG07 | Deadline Watch and Digest | Reminders for renewals, notice periods and filing deadlines; summary emails and Teams/Slack messages. | P1 | B |
| AG08 | Intake and Triage | Request intake, queues, ownership, escalation, status tracking; drafts replies to incoming requests. | P1 | B |
| AG09 | Agent Versions and Clone | Draft and published versions with rollback; clone and customize prebuilt agents. | P2 | P |
| AG10 | Relay and Critic | Chain agents; built-in reviewer agent checks drafts before the lawyer sees them. | P2 | B |
| AG11 | Workbench | Charts, chronologies and calculations inside agent runs. | P2 | P |
| AG12 | Triggers | Event-triggered workflows (new file, email, document change) with controlled write actions. | P2 | B |
| AG13 | Business Self-Service | Approved legal workflows for business users with escalation rules. | P2 | S |
| AG14 | Flow Builder | Drag-and-drop agent workflow editor with branches. | P2 | P |

---

## Connect and Packs

**Purpose:** Provider adapters, document connectors and installable Packs, added after the core workflow is proven.

| ID | Feature | Requirement | Priority | Origin |
|---|---|---|---|---|
| CN01 | Provider Adapters | Retrieval and inference adapters with explicit capabilities and policy constraints. | P0 | B |
| CN02 | First Document Connector | One validated connector (for example SharePoint or iManage) once upload workflows are stable. | P1 | B |
| CN03 | Firm Packs | Private bundles of agents, prompts, templates and knowledge; manifest; install per user, team or firm; never more access than the running user. | P1 | P |
| CN04 | Connector Directory and Permission Sync | Browse connectors; mirror file permissions from source systems. | P2 | B |
| CN05 | MCP and Enterprise APIs | Permission-scoped MCP connections, APIs and external workflow triggers. | P2 | B |
| CN06 | Pack Governance | Signing, sandboxing, admin install approval, upload scanning, versioning with rollback. | P2 | P |
| CN07 | Northwrit SDK | Connector and Pack SDKs, command-line tool, OpenAPI import. | P2 | P |
| CN08 | Pack Exchange | Public marketplace; evaluate after Firm Packs prove demand. | P2 | P |

---

## Shield (privacy and routing)

**Purpose:** Decide, per matter and per step, what may leave the firm's environment, and prove what did.

| ID | Feature | Requirement | Priority | Origin |
|---|---|---|---|---|
| SH01 | Processing Policy | Per-firm and per-matter policy: Local Only, Hybrid or Cloud; the stricter setting wins. At P0, enforced for Hybrid and Cloud with provider visibility. | P0 | B |
| SH02 | Model Gateway | One internal interface over cloud models and local runtimes. | P0 | B |
| SH03 | Shield Log | Records every cloud send: who, what category of data, which model and region, when, and the rule that allowed it. No duplicate sensitive payloads. | P0 | B |
| SH04 | Outbound Boundary | Policy applied to prompts, queries, excerpts, tool parameters, embeddings, screenshots, logs, telemetry and memory sync. | P0 | S |
| SH05 | Local Companion | Permission-scoped folder access, local parsing, indexing, encrypted storage and optional local inference; validated Local Only task subset. | P1 | B |
| SH06 | Smart Routing | Classifies requests as confidential, mixed or public. Privacy and residency are hard constraints; cost and latency optimize only among permitted routes. | P1 | B |
| SH07 | Redact and Restore | Replaces names, companies, amounts and addresses before the cloud and restores them locally. Reduces exposure; does not guarantee anonymity. | P1 | B |
| SH08 | Desktop and Offline Mode | Desktop app with on-device models; offline use with sync on reconnect. | P2 | B |

---

## Security and Admin

**Purpose:** Isolation, authentication, administration and audit.

| ID | Feature | Requirement | Priority | Origin |
|---|---|---|---|---|
| SA01 | Tenant Isolation and Authorization | Tenant isolation and matter-level authorization at ingestion, retrieval, tool use and artifact access. | P0 | B |
| SA02 | Encryption | TLS in transit, AES-256 at rest, Canadian-region storage option. | P0 | B |
| SA03 | Multi-Factor Sign-in | Required for all users. | P0 | P |
| SA04 | No Training | Customer data never used to train models; provider contracts say so. | P0 | P |
| SA05 | Retention and Deletion | Firm-set retention and deletion controls. | P0 | B |
| SA06 | Rate Limits and Budgets | Abuse protection per user and firm; task budgets and usage visibility. | P0 | B |
| SA07 | Users and Roles | Admin, partner, associate, paralegal, reviewer and guest roles. | P0 | B |
| SA08 | Model Policy | Which models and providers are allowed, defaults, local or cloud. | P0 | B |
| SA09 | Audit Trail | Complete activity record, exportable (export at P1). | P0 | B |
| SA10 | Single Sign-On and SCIM | Microsoft, Google and Okta SSO; SCIM provisioning. | P1 | B |
| SA11 | Ethical Walls | Block specific users from specific matters everywhere, including search and agents. | P1 | B |
| SA12 | Canadian Residency | Option to keep all data and processing in Canadian regions. | P1 | P |
| SA13 | Seats, Billing and Feature Toggles | Seat management, subscriptions, feature on/off by group. | P1 | P |
| SA14 | Insights | Usage, time-saved and workflow-outcome analytics. | P2 | B |
| SA15 | SOC 2 and ISO 27001 | Audit readiness. No certification is claimed until achieved. | P2 | P |

---

## Customization

**Purpose:** Personal and firm settings, and additional surfaces.

| ID | Feature | Requirement | Priority | Origin |
|---|---|---|---|---|
| CU01 | Preferences | Default jurisdiction, citation style (McGill Guide or Bluebook), English or French interface, theme, personal instructions. | P0 | P |
| CU02 | House Style | Firm branding, letterhead, terminology, formatting and disclaimers. | P1 | P |
| CU03 | Memory Controls | View, edit or delete what Northwrit remembers; switch memory off. Memory is separated into personal, matter and approved firm knowledge. | P1 | B |
| CU04 | Personal Library | Saved prompts and favourite agents. | P1 | P |
| CU05 | Northwrit Mobile | iOS and Android apps. | P2 | P |
| CU06 | Clip to Matter | Browser extension that saves web pages to a matter. | P2 | P |
| CU07 | White-label | Sell under a partner’s name and domain. | P2 | P |

---

## Quality (internal)

**Purpose:** Measure quality continuously so changes cannot silently make answers worse.

| ID | Feature | Requirement | Priority | Origin |
|---|---|---|---|---|
| QA01 | Northwrit Bench | Versioned set of 50–100 lawyer-reviewed tasks plus a held-out set; rerun on every change to models, retrieval, prompts, tools or policy; release gate. | P0 | B |

---

## Cross-cutting requirements

| Area | Requirement |
|---|---|
| **Citations** | Every generated statement links to a source passage, document location or library item. Uncited text is visibly marked. A resolved citation is not shown as a verified proposition. |
| **Evidence contract** | Each citation records source, version or retrieval time, precise location and jurisdiction when known. Private-document evidence inherits the document's access restrictions. |
| **Review states** | Draft, In review, Changes requested, Approved. Approval belongs to one artifact version; substantive edits or changed evidence invalidate it. |
| **Human approval** | Redlines, external writes and outbound messages are proposals until a lawyer approves the exact payload. |
| **Failure behaviour** | Never silently change jurisdiction, source coverage, model location or scope. Show partial results and name the gap. |
| **Untrusted content** | Retrieved documents and web pages are untrusted, including embedded instructions. Model output cannot grant itself access. |
| **Data-exit paths** | Model calls, web search, connectors, MCP tools and Pack tools are the only ways data leaves a matter. Each is governed by the gateway and audited. |
| **Audit** | Every model call, agent step and change is an audit entry. Sensitive payloads are not duplicated in logs. |
| **Accessibility** | WCAG 2.1 AA for core screens. |
| **Language and spelling** | Canadian spelling. English at P0; French interface and Translate at P1 or later (open decision). |
| **Data portability** | Matters export to an open format (JSON plus original files). |

## Source reconciliation

Where the PRD and the Legal SI disagreed, this spec took the more conservative position.

| Topic | PRD | Legal SI | This spec |
|---|---|---|---|
| Local Only | MVP | P1, validated subset | Policy and logging at P0 (SH01, SH03); Local Only at P1 (SH05); not marketed before isolation tests |
| Review Grid | MVP | P1 | P1 (RV03) |
| Agent Studio and Library | MVP | P1 | P1 (AG04, AG05); P0 has one fixed workflow (AG01) |
| Research Memo | P2 | P0 | P0 (RS06) |
| OCR and email | MVP | P1 | P1 (RV04) |
| Draft from Precedent | MVP | P1 | P1 (DR01) |
| CiteCheck | "Verified", at least 99% | Resolved is not verified | Four labels; Verified only after a support check (RS05) |
| Jurisdiction | Ontario first | Unselected | Ontario is the working assumption; confirm before acceptance testing |
| Cheap trust-critical PRD items | MVP | Not listed | Kept at P0 (SA03, SA04, SA06, MT02, AS03, CU01) |

## Open decisions

1. Launch jurisdiction and practice area (Ontario assumed).
2. Source providers and rights record for each source (CanLII API terms apply).
3. Whether local inference is required at pilot launch or at P1.
4. Which local model and hardware profile to certify.
5. Web search provider for the Answer Engine.
6. Pricing model (seat, firm or usage).
7. French-language support at launch.
8. AG14 is named **Flow Builder** (renamed from the PRD's "Visual Canvas" because Canvas is on the avoid list).
