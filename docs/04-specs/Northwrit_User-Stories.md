# Northwrit User Stories & Acceptance Criteria

> Requirements reconciliation — November 9, 2026. The [Workflow Contracts](Northwrit_Workflow-Contracts.md) govern review invalidation, export eligibility, lifecycle handoffs, and baseline release scope. Architectural approval does not establish implementation status.

**Status:** Proposed | **Version:** 2.0 | **Date:** November 3, 2026

*Coverage: Every one of the **105 features** (38 P0, 39 P1, 28 P2) in [Northwrit_Feature-Spec.md](./Northwrit_Feature-Spec.md) is covered below with Given/When/Then acceptance criteria.*

---

## Module AS: Northwrit Assist (AS01–AS07)

### US-AS01: Pinpoint Citations on Matter Documents (AS01, P0)
**As a** litigator reviewing matter files,  
**I want** every factual assertion in an answer to link to the exact passage in the source document,  
**So that** I can verify the context without hunting through hundred-page records.
- **Given** a matter containing parsed PDF and DOCX files,
- **When** the assistant answers a question based on those documents,
- **Then** every material claim carries a clickable citation marker `[n]` that opens the Evidence Viewer at the exact page and paragraph with the supporting passage highlighted.

### US-AS02: Transparent Model Picker & Provenance (AS02, P0)
**As a** lawyer subject to professional supervision duties,  
**I want** to choose among firm-approved models and see which model produced each answer,  
**So that** I can assess the confidence and processing origin of the response.
- **Given** a firm has configured allowed models under its Model Policy (SA08),
- **When** I select a model and generate an answer,
- **Then** only models permitted by the matter's Processing Policy (SH01) are selectable, and the answer displays the model name, provider, and location (`cloud` or `local`).

### US-AS03: Single-Click Save to Matter (AS03, P0)
**As a** practitioner conducting iterative chat research,  
**I want** to save any answer or output to the matter in one click,  
**So that** my colleagues can review or build upon the finding as a formal matter artifact.
- **Given** a cited answer in an Assist or Research thread,
- **When** I click "Save to Matter",
- **Then** the output is persisted as a Folio artifact in the current matter with all citations and provenance intact.

### US-AS04: Prompt Library, Specialists & My Style (AS04, AS05, AS06, P1)
**As a** lawyer drafting and researching across practice areas,  
**I want** a searchable Prompt Library (AS04), admin-configured Specialists (AS05), and a personal My Style profile learned from my writing samples (AS06),  
**So that** routine prompts, domain instructions, and my writing voice are applied consistently.
- **Given** published prompts in the Prompt Library (AS04), an admin-created Specialist assistant (AS05), and uploaded writing samples under My Style (AS06),
- **When** I invoke a prompt or Specialist in a matter and apply My Style to a draft,
- **Then** the Specialist uses only tools and knowledge permitted for that matter, and the draft adopts my stylistic preferences without altering cited text.

### US-AS05: Voice Dictation Prompts (AS07, P2)
**As a** mobile or desktop user,  
**I want** to dictate prompts by voice (AS07),  
**So that** I can capture questions hands-free under the same matter policy.
- **Given** a matter that permits audio transcription under its Processing Policy,
- **When** I record a voice prompt (AS07),
- **Then** speech is transcribed into the prompt box for review before submission, and blocked in Local Only unless local speech-to-text is active.

---

## Module RS: Northwrit Research (RS01–RS11)

### US-RS01: Answer Engine & Bearings Clarification (RS01, RS02, P0)
**As a** researcher querying legal principles,  
**I want** live cited answers from permitted sources (RS01) after Bearings clarifies missing jurisdiction, relevant date, side, and material facts (RS02),  
**So that** the system never silently assumes scope or applies the wrong law.
- **Given** I submit a legal research question missing jurisdiction or relevant date,
- **When** the Research service evaluates the request,
- **Then** Bearings (RS02) prompts for the missing fields before searching, and the Answer Engine (RS01) returns an answer with claim-level citations and a source panel.

### US-RS02: Source Filters & Labelled Synthesis (RS03, RS04, P0)
**As a** research lawyer,  
**I want** source filters with visible coverage limits (RS03) and a synthesis that labels each claim by source origin and separates supporting authority, contrary authority, assumptions, inference, and unknowns (RS04),  
**So that** I see the full evidentiary picture and any gaps.
- **Given** an active research query with Source Filters applied (RS03),
- **When** the synthesis is presented (RS04),
- **Then** coverage limits are displayed, each claim is marked as *Matter Document* or *Public Source*, and contrary authorities and unknowns are separated explicitly.

### US-RS03: CiteCheck Four-State Verification (RS05, P0)
**As a** lawyer responsible for candour to the court,  
**I want** every cited authority resolved and checked against its passage text before I rely on it (RS05),  
**So that** fabricated or mis-cited authorities are caught immediately.
- **Given** a draft answer or memo containing legal citations,
- **When** CiteCheck (RS05) runs,
- **Then** it resolves each citation and verifies passage support, assigning `Verified`, `Unverified`, `Contradicted`, or `Unavailable`, without implying a citator check unless licensed authority-treatment data (RS10) is active.

### US-RS04: Editable Research Memo Generation (RS06, P0)
**As an** associate preparing client advice,  
**I want** to generate an editable legal research memo with a table of authorities (RS06),  
**So that** I can move from research to a structured, reviewable deliverable.
- **Given** completed research findings and matter facts,
- **When** I generate a Research Memo (RS06),
- **Then** Northwrit creates a structured Folio containing Facts, Issues, Rule, Analysis, Table of Authorities, Limitations, and Conclusion with claim-level citations attached.

### US-RS05: Deep Research & Beacon Monitoring (RS07, RS08, P1)
**As a** researcher handling complex or ongoing issues,  
**I want** planned multi-step Deep Research with steering (RS07) and Beacon alerts on new decisions, regulatory changes, or docket activity (RS08),  
**So that** I can steer long research plans and stay informed when relevant law changes.
- **Given** a complex research task or a saved Beacon monitor on a matter,
- **When** Deep Research (RS07) executes or a new authority matching Beacon criteria (RS08) is published,
- **Then** I can inspect progress, interrupt or steer the plan mid-run, and receive matter-scoped Beacon notifications with citations.

### US-RS06: Triangulate, Authority Treatment & Dispatch Feed (RS09, RS10, RS11, P2)
**As a** senior researcher,  
**I want** multi-model comparison via Triangulate (RS09), cross-jurisdiction and subsequent-history Authority Treatment checks where licensed data supports them (RS10), and a practice-area Dispatch news feed (RS11),  
**So that** model disagreements are surfaced as diagnostics and appellate history is checked when licensed.
- **Given** a research question run with Triangulate (RS09) or Authority Treatment (RS10), and a practice-area filter in Dispatch (RS11),
- **When** results render,
- **Then** model disagreements are highlighted as diagnostic signals (not proof), subsequent history is shown only from licensed citator sources, and Dispatch surfaces relevant legal news.

---

## Module RV: Northwrit Review (RV01–RV07)

### US-RV01: Smart Upload & Document Versions (RV01, RV02, P0)
**As a** lawyer uploading client disclosures,  
**I want** PDF and DOCX files extracted, indexed, and version-tracked (RV02) with any failure naming the exact document and reason (RV01),  
**So that** I never mistakenly assume an unreadable file was included in the analysis.
- **Given** I upload PDF and DOCX files to a matter,
- **When** ingestion completes,
- **Then** readable files are indexed with version numbers, source locations, and inherited document permissions (RV02), and any failed file displays `Failed` with the document name and reason (RV01).

### US-RV02: Review Grid, OCR/Email Ingestion, Auto-Sort & Precedent Bank (RV03, RV04, RV05, RV06, P1)
**As a** corporate associate conducting due diligence,  
**I want** scanned files and emails ingested with OCR (RV04), documents auto-sorted with duplicate detection (RV05), a multi-document Review Grid with cited cells and Excel export (RV03), and a versioned Precedent Bank (RV06),  
**So that** large data rooms and firm precedents are organized and reviewed at scale.
- **Given** a data room containing scans, emails, and contracts,
- **When** OCR/email ingestion (RV04) and Auto-Sort (RV05) finish and I run a Review Grid (RV03) or query the Precedent Bank (RV06),
- **Then** parsing failures are explicit, duplicates are flagged, every Review Grid cell cites its source passage and exports to Excel, and Precedent Bank items show their owner and version.

### US-RV03: Portfolio Compare & Obligation Extraction (RV07, P2)
**As** in-house counsel managing contract portfolios,  
**I want** to compare a clause across many agreements and extract obligations and renewal dates (RV07),  
**So that** portfolio-wide deviations and upcoming renewals are tracked with citations.
- **Given** a portfolio of executed agreements in a matter,
- **When** I run Portfolio Compare (RV07),
- **Then** clause variations, obligations, and renewal dates are extracted into a cited comparison view.

---

## Module DR: Northwrit Draft (DR01–DR07)

### US-DR01: Draft from Precedent, Playbooks, Redlining & Word Add-in (DR01, DR02, DR03, DR04, DR05, P1)
**As** contract counsel drafting and negotiating agreements,  
**I want** to draft from approved templates (DR01), store firm Playbooks (DR02), run Playbook Check with proposed tracked-change redlines (DR03) and a Redline Report issue list (DR04), and access Assist, Draft, and Playbook Check inside Microsoft Word (DR05),  
**So that** contracts follow firm positions and redlines remain proposals until I approve them.
- **Given** approved precedents (DR01) and a versioned Playbook (DR02) in web or Northwrit for Word (DR05),
- **When** I draft an agreement or run Playbook Check on a counterparty markup (DR03, DR04),
- **Then** deviations are listed in a Redline Report and proposed tracked changes require lawyer approval before being applied.

### US-DR02: Northwrit for Outlook & Document Translation (DR06, DR07, P2)
**As a** bilingual practitioner working across email and documents,  
**I want** an Outlook add-in for summaries, draft replies, and filing to matters (DR06), and English/French document translation (DR07),  
**So that** email threads file cleanly to matters and bilingual documents preserve legal terminology.
- **Given** an email in Outlook (DR06) or a document requiring English-French translation (DR07),
- **When** I invoke filing, reply drafting, or Translate,
- **Then** filing inherits the matter's permissions and policy, replies remain drafts for user send, and translated output preserves structure and citations.

---

## Module MT: Northwrit Matters (MT01–MT08)

### US-MT01: Matter Workspace, Standing Instructions & Visible Policy (MT01, MT02, MT03, P0)
**As a** matter lead,  
**I want** each client engagement isolated in its own workspace (MT01) with standing Matter Instructions (MT02) and a permanently visible Privacy Setting (MT03),  
**So that** access controls apply before ingestion and every request follows matter guidance.
- **Given** I create a Matter with participants, roles, client/matter number (MT01), Matter Instructions (MT02), and Privacy Setting (MT03),
- **When** any user works inside the matter,
- **Then** access controls are enforced before any file is ingested, standing instructions apply to every request, and the processing mode, jurisdiction, and source scope remain visible at all times.

### US-MT02: Fact Sheet, Matter Templates, Dashboard & Client Rooms (MT04, MT05, MT06, MT07, P1)
**As a** partner managing active matters,  
**I want** an editable Fact Sheet with provenance (MT04), Matter Templates by practice type (MT05), a Matter Dashboard of key dates, tasks, and runs (MT06), and Client Rooms for scoped guest collaboration (MT07),  
**So that** matter memory is structured and external guests only see explicitly shared items.
- **Given** a matter initialized from a Matter Template (MT05),
- **When** facts are added to the Fact Sheet (MT04), activity updates the Dashboard (MT06), or a guest enters a Client Room (MT07),
- **Then** each fact links to its source passage, and Client Room guests cannot access unshared documents or internal threads.

### US-MT03: Legal Hold Lifecycle (MT08, P2)
**As a** compliance administrator,  
**I want** to place a matter on Legal Hold (MT08),  
**So that** scheduled retention expiry and manual deletions are blocked until the hold is released.
- **Given** a matter placed under Legal Hold (MT08),
- **When** a user or retention job attempts to delete documents or artifacts in that matter,
- **Then** the deletion is blocked with `423 legal_hold` and an audit event is recorded.

---

## Module SO: Search & Outputs (SO01–SO12)

### US-SO01: Permission-Scoped Hybrid Search (SO01, P0)
**As a** user searching across Northwrit,  
**I want** one search box combining keyword and semantic search across matters, documents, threads, and Folios (SO01),  
**So that** I find relevant work immediately without ever seeing content from unauthorized matters.
- **Given** a search query entered in Northwrit Search (SO01),
- **When** hybrid keyword and vector retrieval executes,
- **Then** permission, matter, and ethical-wall filters are applied inside the query before ranking.

### US-SO02: Folios, Review States, History & DOCX Export (SO02, SO03, SO04, SO05, P0)
**As a** reviewing partner,  
**I want** editable Folios beside the chat (SO02) with version compare/restore (SO04), version-bound Review States (SO03), and DOCX export (SO05),  
**So that** any subsequent edit or changed source evidence invalidates approval until re-reviewed.
- **Given** a Folio (SO02) with version history (SO04) transitioning through `Draft` → `In review` → `Changes requested` → `Approved` (SO03),
- **When** a substantive edit occurs or cited source evidence changes,
- **Then** `Approved` is automatically invalidated, and DOCX export (SO05) records citations, assumptions, scope, and the selected version state.

### US-SO03: Branded PDF/Excel Export, Quick Jump, Saved Searches & Timelines (SO06, SO07, SO08, SO09, P1)
**As a** practitioner producing client deliverables,  
**I want** branded PDF and Excel exports (SO06), a `Ctrl/Cmd+K` Quick Jump palette (SO07), Conversation & Saved Searches (SO08), and event Timelines extracted from matter documents (SO09),  
**So that** navigation is fast and chronologies and tables export cleanly.
- **Given** matter documents and past threads,
- **When** I use Quick Jump (SO07), rerun a Saved Search (SO08), build a Timeline (SO09), or export to PDF/Excel (SO06),
- **Then** every timeline event cites its source passage and exports carry the firm's House Style branding.

### US-SO04: Charts & Decks, Legal Calculators & Client Briefs (SO10, SO11, SO12, P2)
**As a** lawyer presenting findings to a client,  
**I want** visual Charts and Decks (SO10), deterministic Calculators for limitation periods, interest, and damages (SO11), and access-controlled Client Briefs (SO12),  
**So that** calculations are reproducible from cited inputs and shared briefs remain governed.
- **Given** cited dates and amounts in a matter,
- **When** I run a Calculator (SO11), generate a Chart/Deck (SO10), or share a Client Brief (SO12),
- **Then** calculations execute deterministically showing formula and inputs, and Client Briefs enforce viewer access controls.

---

## Module AG: Agents & Automate (AG01–AG14)

### US-AG01: Bounded Research-to-Memo Workflow, Run Trail & Checkpoints (AG01, AG02, AG03, P0)
**As a** lawyer running multi-step research and drafting,  
**I want** a bounded workflow with persisted steps, cancellation, and resume (AG01), a full Run Trail (AG02), and lawyer Checkpoints before key steps or external writes (AG03),  
**So that** execution is transparent, resumable, and human-approved.
- **Given** I start the Research-to-Memo workflow (AG01),
- **When** steps execute,
- **Then** the Run Trail (AG02) logs tool outcomes, sources, model/provider identity, and usage, cancellation stops new side effects while keeping completed steps, and Checkpoints (AG03) require approval of the exact payload hash before any external write.

### US-AG02: Agent Library, Agent Studio, Schedules, Deadline Watch & Intake Triage (AG04, AG05, AG06, AG07, AG08, P1)
**As a** practice group lead automating recurring legal work,  
**I want** prebuilt starter agents in the Agent Library (AG04), plain-English agent creation and sample testing in Agent Studio (AG05), scheduled runs (AG06), Deadline Watch & Digest notifications (AG07), and Intake & Triage queues (AG08),  
**So that** routine workflows run reliably under matter policy and propose drafts for lawyer approval.
- **Given** an agent from the Agent Library (AG04) or built and test-run in Agent Studio (AG05),
- **When** triggered on a Schedule (AG06), by an approaching deadline (AG07), or via an Intake queue item (AG08),
- **Then** it uses only tools permitted for the matter and user, respects task budgets, and places drafted replies or changes into lawyer approval checkpoints.

### US-AG03: Agent Versions/Clone, Relay & Critic, Workbench, Triggers, Self-Service & Flow Builder (AG09, AG10, AG11, AG12, AG13, AG14, P2)
**As an** advanced workflow designer,  
**I want** draft/published Agent Versions with rollback and cloning (AG09), multi-agent Relay chaining and a built-in Critic reviewer (AG10), an in-run Workbench for charts and calculations (AG11), event Triggers (AG12), Business Self-Service workflows with escalation rules (AG13), and a drag-and-drop Flow Builder (AG14),  
**So that** complex multi-step workflows can be composed visually, reviewed by a Critic agent, and safely exposed to business teams.
- **Given** a multi-step agent composed in Flow Builder (AG14) with version control (AG09), Relay/Critic steps (AG10), and Workbench tools (AG11),
- **When** invoked by an event Trigger (AG12) or Business Self-Service portal (AG13),
- **Then** the Critic flags unsupported claims before the lawyer sees the draft, escalation rules route non-standard cases to legal, and external writes require checkpoint approval.

---

## Module CN: Connect & Packs (CN01–CN08)

### US-CN01: Policy-Constrained Provider Adapters (CN01, P0)
**As a** platform architect,  
**I want** retrieval and inference providers wrapped in explicit adapters declaring region, capabilities, and data terms (CN01),  
**So that** Shield enforces policy constraints uniformly across providers.
- **Given** a configured provider adapter (CN01),
- **When** the gateway evaluates candidate routes,
- **Then** it verifies the adapter's declared region, capabilities, and contractual no-training terms against the active Processing Policy.

### US-CN02: First Document Connector & Private Firm Packs (CN02, CN03, P1)
**As a** firm administrator integrating internal systems and know-how,  
**I want** a validated document connector (CN02) and installable private Firm Packs with a permission manifest (CN03),  
**So that** documents sync cleanly and packaged know-how never gains more access than the user running it.
- **Given** a configured document connector (CN02) or an installed Firm Pack (CN03),
- **When** a user syncs files or runs a Pack agent/template,
- **Then** source permissions are respected and the Pack executes strictly within the running user's and matter's authorization scope.

### US-CN03: Connector Directory, MCP/APIs, Pack Governance, SDK & Pack Exchange (CN04, CN05, CN06, CN07, CN08, P2)
**As an** enterprise integrator or Pack developer,  
**I want** a Connector Directory with permission sync (CN04), permission-scoped MCP and Enterprise APIs (CN05), Pack signing, sandboxing, upload scanning, and admin install approval (CN06), a Northwrit SDK (CN07), and a public Pack Exchange (CN08),  
**So that** third-party integrations and marketplace Packs cannot exfiltrate data or bypass Shield.
- **Given** a Pack or MCP integration built with the Northwrit SDK (CN07) and submitted to Firm install or Pack Exchange (CN08),
- **When** scanned, signed, and approved under Pack Governance (CN06) or called via MCP/API (CN05) with synced permissions (CN04),
- **Then** sandboxed tools pass through the Tool Gateway and Outbound Boundary with full audit logging.

---

## Module SH: Northwrit Shield (SH01–SH08)

### US-SH01: Processing Policy, Model Gateway, Shield Log & Outbound Boundary (SH01, SH02, SH03, SH04, P0)
**As a** firm administrator,  
**I want** every model and tool call routed through a single Model Gateway (SH02) that enforces the stricter of firm or matter Processing Policy (SH01) across all nine Outbound Boundary categories (SH04) and logs every cloud send in the Shield Log (SH03),  
**So that** no matter data ever leaves our boundary unapproved or unrecorded.
- **Given** a Firm Policy and Matter Policy (SH01),
- **When** any module requests inference, embeddings, or external search through the Model Gateway (SH02),
- **Then** the Outbound Boundary (SH04) checks all categories (`prompt`, `research_query`, `excerpt`, `tool_parameter`, `embedding`, `screenshot`, `log`, `telemetry`, `memory_sync`), blocks disallowed routes (`blocked_by_policy`) without silent escalation, and records every cloud send or blocked attempt in the append-only Shield Log (SH03) without duplicating sensitive payloads.

### US-SH02: Local Companion, Smart Routing & Redact and Restore (SH05, SH06, SH07, P1)
**As a** privacy officer handling confidential client matters,  
**I want** a Local Companion with a validated Local Only task subset (SH05), Smart Routing that treats privacy and residency as hard constraints (SH06), and Redact & Restore placeholder substitution (SH07),  
**So that** Local Only matters have zero unapproved network egress and Hybrid matters minimize identifier exposure.
- **Given** a Local Only matter using the Local Companion (SH05) or a Hybrid matter using Smart Routing (SH06) and Redact & Restore (SH07),
- **When** a task executes,
- **Then** Local Only makes zero unapproved external network connections, Smart Routing optimizes cost/latency only among policy-permitted routes, and Redact & Restore replaces sensitive entities before cloud transmission and restores them locally while stating clearly that redaction does not guarantee anonymity.

### US-SH03: Desktop App & Full Offline Mode (SH08, P2)
**As a** lawyer working while travelling or in air-gapped environments,  
**I want** a standalone Desktop App with on-device models and Offline Mode (SH08),  
**So that** I can review documents and draft offline and sync safely on reconnect.
- **Given** Northwrit Desktop in Offline Mode (SH08),
- **When** I work with no internet connection and later reconnect,
- **Then** local tasks complete on-device and sync on reconnect respects the matter's Processing Policy.

---

## Module SA: Security & Admin (SA01–SA15)

### US-SA01: Tenant Isolation, Encryption, MFA & Roles (SA01, SA02, SA03, SA07, P0)
**As a** security administrator,  
**I want** row-level tenant and matter isolation (SA01), TLS and AES-256 encryption with Canadian-region storage (SA02), mandatory MFA (SA03), and role-based access control (SA07),  
**So that** unauthorized users cannot access firm or matter data.
- **Given** users assigned roles (`admin`, `partner`, `associate`, `paralegal`, `reviewer`, `guest` under SA07),
- **When** they authenticate and access resources,
- **Then** MFA is enforced (SA03), data is encrypted in transit and at rest (SA02), and authorization is checked at ingestion, retrieval, tool use, and artifact access (SA01).

### US-SA02: No-Training Guarantee, Retention, Budgets, Model Policy & Audit Trail (SA04, SA05, SA06, SA08, SA09, P0)
**As a** managing partner,  
**I want** contractual no-training terms (SA04), retention/deletion rules (SA05), rate limits and task budgets (SA06), Model Policy controls (SA08), and a complete Audit Trail (SA09),  
**So that** the firm governs cost, data lifecycle, and compliance.
- **Given** firm admin settings in the Control Centre,
- **When** an administrator configures allowed models (SA08), retention schedules (SA05), and budgets (SA06),
- **Then** only providers with no-training contracts (SA04) can be enabled, expired data is deleted on schedule, budget caps halt runaway tasks, and every activity is recorded in an append-only Audit Trail (SA09).

### US-SA03: SSO/SCIM, Ethical Walls, Canadian Residency & Seat/Feature Toggles (SA10, SA11, SA12, SA13, P1)
**As an** IT administrator at a mid-size firm,  
**I want** Microsoft/Google/Okta SSO and SCIM provisioning (SA10), Ethical Walls enforced across search, agents, and exports (SA11), a strict Canadian Residency toggle (SA12), and Seat, Billing & Feature Toggles by group (SA13),  
**So that** firm identity, conflict screens, and data residency are centrally enforced.
- **Given** an Ethical Wall blocking User X from Matter Y (SA11) and Canadian Residency enabled (SA12),
- **When** User X runs a search or agent, or any user triggers a model call,
- **Then** zero results or existence hints from Matter Y reach User X, and all storage and model processing stay in Canadian regions.

### US-SA04: Usage Insights & SOC 2 / ISO 27001 Readiness (SA14, SA15, P2)
**As** firm leadership evaluating ROI and vendor assurance,  
**I want** Insights analytics on usage and workflow outcomes (SA14) and verifiable SOC 2 / ISO 27001 audit readiness (SA15),  
**So that** adoption is measurable and compliance claims are backed by evidence.
- **Given** aggregated content-free telemetry (SA14) and the compliance control register (SA15),
- **When** admins view Insights or request assurance documentation,
- **Then** metrics show active seats and accepted artifacts without exposing matter text, and no certification is claimed until formally achieved.

---

## Module CU & QA: Customization & Quality (CU01–CU07, QA01)

### US-CU01: User Preferences (CU01, P0)
**As a** lawyer,  
**I want** to configure my default jurisdiction, citation style (McGill Guide or Bluebook), interface language, theme, and personal instructions (CU01),  
**So that** Northwrit matches my practice defaults.
- **Given** my saved Preferences (CU01),
- **When** I start a research thread or Folio,
- **Then** my citation style and personal instructions apply unless overridden by Matter Instructions.

### US-CU02: House Style, Scoped Memory Controls & Personal Library (CU02, CU03, CU04, P1)
**As a** lawyer and firm administrator,  
**I want** firm House Style branding and disclaimers (CU02), transparent Memory Controls separated into personal, matter, and firm knowledge (CU03), and a Personal Library of saved prompts and favourite agents (CU04),  
**So that** exports match firm letterhead and memory never leaks across matters.
- **Given** House Style templates (CU02), Memory Controls (CU03), and a Personal Library (CU04),
- **When** I view/edit/delete memory entries or export a Folio,
- **Then** private matter facts never cross into another matter or shared knowledge without an explicit permitted operation, and exports apply House Style formatting.

### US-CU03: Mobile Apps, Clip to Matter & White-Label (CU05, CU06, CU07, P2)
**As a** practitioner on the go or an institutional partner,  
**I want** iOS and Android apps (CU05), a Clip to Matter browser extension (CU06), and White-Label partner branding (CU07),  
**So that** web research clips directly into a matter and mobile access upholds the same Shield and MFA rules.
- **Given** the Northwrit Mobile app (CU05) or Clip to Matter extension (CU06),
- **When** I save a web page or view a Folio,
- **Then** MFA, matter authorization, Shield policy, and audit logging apply identically to the web workspace.

### US-QA01: Northwrit Bench CI Release Gate (QA01, P0)
**As an** engineering lead,  
**I want** a versioned suite of 50–100 lawyer-reviewed legal tasks plus a held-out set run automatically on every change to models, retrieval, prompts, tools, or policy (QA01),  
**So that** any quality or security regression blocks the release.
- **Given** a pull request modifying prompts, retrieval, model adapters, or Shield policy,
- **When** the CI pipeline executes Northwrit Bench (QA01),
- **Then** the build fails if claim support, citation resolution, fabrication rate, or isolation metrics fall below gate thresholds (G1–G6).
