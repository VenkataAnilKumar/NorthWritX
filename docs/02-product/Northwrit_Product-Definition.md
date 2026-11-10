# Northwrit Product Definition Document

**Version:** 2.0 | **Date:** November 3, 2026 | **Status:** Proposed Baseline

---

## Table of Contents

1. Executive Summary
2. Problem Statement
3. Target Audience & Personas
4. Product Principles
5. Core Capabilities & Value Proposition
6. Features by Release
7. Market Positioning
8. Business Model Hypothesis
9. Technical & Operational Requirements
10. Success Metrics & Pilot Gates (KPIs)
11. Risks, Dependencies & Mitigations
12. Research Basis
13. Appendix: Glossary

---

## 1. Executive Summary

Northwrit is an AI-powered legal intelligence workspace engineered for Canadian law firms (10–300 lawyers, Ontario launch focus) and corporate legal teams. It resolves the three fundamental barriers impeding legal AI adoption:
1. **Privilege & Confidentiality:** Client files cannot be exposed to foreign cloud models or public training sets.
2. **Hallucination & Legal Accuracy:** General LLMs invent case citations and distort statutory tests.
3. **Enterprise Economics:** US enterprise platforms (Harvey, Legora) require six-figure minimum commitments built around US federal practice.

Northwrit solves this by pairing cited legal retrieval with **Northwrit Shield**—a hybrid privacy engine enforcing matter-level routing, on-premises/local model options, and an auditable outbound data boundary.

---

## 2. Problem Statement

1. **The Confidentiality Impasse:** Under Law Society rules (e.g., Law Society of Ontario Rules of Professional Conduct), lawyers owe strict duties of confidentiality and supervision. Sending unredacted client facts to standard third-party AI violates client retainers and privilege.
2. **Citation Fiction:** AI tools frequently synthesize plausible-sounding citations to non-existent precedents or cite authorities that have been overturned or distinguished.
3. **Fragmented Workflows:** Practitioners research public law in one system (CanLII, Westlaw), inspect private client disclosures in file drives, and draft in Word, resulting in broken evidence provenance and costly manual rework.

---

## 3. Target Audience & Personas

### Target Segments

| Segment | Who | Main Need |
|---|---|---|
| **Small and mid-size firms** | 10–300 lawyers; Ontario first (to be confirmed) | Big Law capability at a reachable price, with confidentiality. |
| **In-house legal teams** | Canadian corporates and public bodies | Contract review, playbooks, regulatory monitoring. |
| **Large firms (later)** | National firms | Local-only mode, ethical walls, document-management integration. |

### User Personas

| Persona | Role | Primary Need | Success Signal |
|---|---|---|---|
| **Sarah (Litigation Associate)** | 4th-year associate at a 40-lawyer Toronto firm | Prepare comprehensive research memos applying Ontario and federal jurisprudence to client facts. | ≥30% reduction in drafting time; 100% cited passages verified against source text. |
| **Marc (General Counsel)** | GC at a mid-market Canadian tech company | Review incoming commercial vendor contracts against corporate risk playbooks under Quebec Law 25 & PIPEDA. | Zero missed non-standard indemnities; zero client data egress outside Canada. |
| **Elena (Managing Partner / Risk Lead)** | Managing Partner at a regional firm | Maintain ethical walls, ensure compliance with LSO guidelines, verify that junior staff properly supervise AI output. | Complete audit trail of all model interactions; verifiable Local Only execution on sensitive files. |
| **David (Knowledge Manager)** | KM Director at a commercial firm | Standardize firm precedent clauses, templates, and firm-wide research methods into repeatable tools. | Reusable firm playbooks and Packs deployed without leaking client matter data. |
| **Liam (Legal Operations Manager)** | Legal Ops at a 120-lawyer firm | Route incoming requests, manage matter budgets, and track turnaround across practice groups. | Clear intake queues, predictable task costs, measurable workflow adoption. |

---

## 4. Product Principles

1. **Evidence Before Fluency:** Fluent prose without cited support is a defect. Unsubstantiated claims are flagged prominently.
2. **A Resolved Link is Not a Good-Law Check:** Resolving a link to CanLII does not verify that a case remains good law. Citator claims are never made without licensed judicial history data.
3. **Never Silently Change Scope:** The system must never silently alter jurisdiction, drop dates, or reroute across network boundaries to satisfy a prompt. If a route is blocked, surface the stoppage.
4. **Policy is a Hard Constraint:** Privacy and residency rules override cost and latency. If no eligible route exists, the step is blocked rather than escalated to cloud.
5. **Lawyer Maintains Ultimate Accountability:** The platform generates reviewable drafts, not autonomous work. Approvals are tied to specific artifact versions.
6. **Untrusted Input Boundary:** All ingested files and retrieved web content are treated as potentially malicious or prompt-injected inputs.
7. **Claims Need Proof:** No certification (SOC 2, ISO 27001), privilege protection, or comprehensive legal coverage is claimed without evidence.

---

## 5. Core Capabilities & Value Proposition

| Capability | What It Does | Value Proposition |
|---|---|---|
| **Northwrit Assist** | Conversational Q&A grounded exclusively in matter records with pinpoint citations. | Rapid, accurate understanding of large complex record disclosures. |
| **Northwrit Research & CiteCheck** | Live synthesis of Canadian law; verifies every assertion against underlying paragraph text. | Eliminates fabricated case citations; automates memo drafting. |
| **Northwrit Review (P1)** | Tabular multi-document extraction grid with cited cell values. | Accelerates due diligence, lease analysis, and disclosure audits. |
| **Northwrit Draft & Playbooks (P1)** | Precedent-driven contract drafting, clause checking, and redlining. | Enforces firm negotiation positions and risk standards. |
| **Northwrit Shield** | Gateway enforcing Local Only, Hybrid, or Cloud privacy policies per matter. | Preserves solicitor-client privilege and satisfies Canadian privacy laws. |

---

## 6. Features by Release

Feature IDs correspond directly to [Northwrit_Feature-Spec.md](../04-specs/Northwrit_Feature-Spec.md) and [Northwrit_Implementation-Phases.md](../07-implementation/Northwrit_Implementation-Phases.md):

```
   Phase 1: Pilot (P0)          Phase 2: Expansion (P1)        Phase 3: Platform (P2)
   ┌──────────────────────┐     ┌────────────────────────┐     ┌──────────────────────┐
   │ 38 Core Features     │ ──► │ 39 Workflow Features   │ ──► │ 28 Scale Features    │
   │ • Matter Workspace   │     │ • Review Grid (Tables) │     │ • Outlook Add-in     │
   │ • Smart Upload       │     │ • Playbooks & Redlines │     │ • Pack Exchange      │
   │ • Research Engine    │     │ • Word Add-in (DR05)   │     │ • Multi-Agent Relay  │
   │ • CiteCheck (RS05)   │     │ • Local Companion (SH05│     │ • Mobile Apps        │
   │ • Research Memo      │     │ • Agent Studio (AG05)  │     │ • Full Offline Mode  │
   │ • Shield Policy & Log│     │ • OCR & Email (RV04)   │     │ • Legal Hold (MT08)  │
   │ • Bench CI Gate      │     │ • SSO / SCIM / Walls   │     │ • White-Label Options│
   └──────────────────────┘     └────────────────────────┘     └──────────────────────┘
```

---

## 7. Market Positioning

- **Against US Enterprise Cloud (Harvey, Legora):** Comparable research and review depth, built specifically around Canadian jurisprudence and priced for 10–300 lawyer firms, with verifiable local/hybrid privacy controls.
- **Against Generalist Research AI (Perplexity, ChatGPT):** Matter isolation, private document synthesis, four-state CiteCheck verification, and zero-training guarantees.
- **Positioning Hypothesis:** Continuous evidence provenance from public authority and private matter facts to the reviewed deliverable, combined with enforceable processing-location policy.

---

## 8. Business Model Hypothesis

*Note: Pricing and commercial tiers represent unvalidated working hypotheses to be tested with design partners during Discovery. No price is fixed here.*

- **Pilot Structure:** 3–5 design partner firms on scoped pilot agreements with clearly disclosed source-licence boundaries.
- **Commercial Structure Options to Evaluate:**
  - **Team Seat Subscription:** Base access to the Canadian cloud workspace, Assist, Research, Review, and Draft.
  - **Metered Compute Tasks:** Usage-based accounting for heavy multi-step agent runs or bulk Review Grid extractions (SA06).
  - **Firm Server / Local Companion Option:** Self-hosted deployment tier for firms requiring Local Only execution.

---

## 9. Technical & Operational Requirements

| Area | Requirement |
|---|---|
| **Deployment Tiers** | Canadian-region cloud workspace (P0); Firm Server via Docker Compose and Local Companion (P1); Desktop Offline (P2). |
| **Database & Search** | PostgreSQL with row-level security (SA01), full-text search, and pgvector (cloud) / LanceDB (local companion). |
| **Model Gateway** | Single internal interface (SH02) over cloud providers (Anthropic, OpenAI, Google) and local runtimes (vLLM, Ollama, llama.cpp). |
| **Security & Auth** | TLS in transit, AES-256 at rest (SA02), mandatory MFA (SA03), SSO/SCIM at P1 (SA10). |
| **Accessibility** | WCAG 2.1 AA across all core workspace screens. |
| **Evaluation** | Northwrit Bench (50–100 lawyer-reviewed tasks plus held-out set) running in CI on every prompt, retrieval, model, or policy change (QA01). |

---

## 10. Success Metrics & Pilot Gates (KPIs)

Proposed engineering targets from the Legal SI specification (to calibrate with pilot reviewers):

| Metric | Target | Gate |
|---|---|---|
| **Access Isolation** | 0 cross-matter or cross-tenant disclosures in adversarial tests | G2 |
| **Citation Resolution** | 100% of exported citations resolve or are marked unavailable | G4 |
| **Citation Validity** | ≥99% of citations labelled *Verified* confirmed by lawyer sampling | G4 |
| **Claim Support Rate** | ≥95% of sampled material claims supported by cited passage; 0 fabricated authorities | G1 |
| **Unsupported Claim Rate** | ≤2% of claims with no supporting source on Northwrit Bench | G1 |
| **Issue Coverage** | ≥90% recall of reviewer-labelled material issues | G1 |
| **Operational Completion** | ≥95% completion on supported tasks; no silent partial successes | G6 |
| **Time Saved** | ≥30% lower median time to an accepted memo vs. baseline | G10 |
| **Pilot Adoption** | ≥60% weekly active seats; ≥50% pilot conversion to paid | G11 |

---

## 11. Risks, Dependencies & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| **Invented or unsupported citations** | Reliance on bad law; reputational damage | CiteCheck on every answer (RS05); Northwrit Bench gates every release (QA01); explicit four-state labels. |
| **Content terms of use (CanLII)** | Restrictions on automated scraping or full-text storage | Maintain a `source_rights` record per source (D.2); use API metadata as permitted; seek written agreements. |
| **Redaction misses identifying context** | Confidential facts inferable from context reach cloud | State clearly that redaction does not guarantee anonymity (SH07); require Local Only for highest-risk matters. |
| **Local models weaker than cloud** | Lower analytical quality in Local Only mode | Display model identity on every answer (AS02); certify a specific task subset and hardware profile (SH05). |
| **Prompt injection via untrusted files** | Exfiltration or unauthorized tool calls | Delimit untrusted retrieved text; validate tool schemas; require human checkpoint approval for external writes (AG03). |

---

## 12. Research Basis

Synthesizes product benchmarks across Harvey AI (Vault, Workflows, Word Add-in), Legora (Tabular Review, Monitors), Perplexity (cited answer UX, Deep Research), Law Society of Ontario generative AI guidance (confidentiality, competence, supervision), and Canadian privacy statutes (PIPEDA, Quebec Law 25). See [Competitive Analysis](../03-market/Northwrit_Competitive-Analysis.md) and [Security & Compliance](../06-technical/Northwrit_Security-Compliance.md).

---

## 13. Appendix: Glossary

| Term | Meaning |
|---|---|
| **Matter** | The isolated workspace and security boundary for one client engagement (MT01). |
| **Folio** | An editable, versioned work product (memo, review table, draft) opened beside the chat (SO02). |
| **Bearings** | Pre-search clarification prompt for missing jurisdiction, date, side, and material facts (RS02). |
| **CiteCheck** | Citation resolution and passage-support verification assigning *Verified*, *Unverified*, *Contradicted*, or *Unavailable* (RS05). |
| **Northwrit Shield** | The privacy policy engine, Model Gateway, redaction pipeline, and outbound boundary logger (SH01–SH07). |
| **Shield Log** | Append-only record of every outbound cloud transmission recording categories and rules without duplicating sensitive payloads (SH03). |
| **Run Trail** | Step-by-step audit record of an agent or workflow execution (AG02). |
| **Northwrit Pack** | Installable bundle of practice-area agents, prompts, templates, and playbooks governed by least privilege (CN03). |
| **Northwrit Bench** | Internal evaluation suite of 50–100 lawyer-reviewed legal tasks run in CI (QA01). |
