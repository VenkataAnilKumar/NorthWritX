# NorthWrit Product Overview

> Delivery status — November 14, 2026: This document describes target behaviour. The [implementation plan](../07-implementation/NorthWrit-Implementation-Plan.md) tracks delivered work; the [current implementation](../06-technical/NorthWrit-Current-Implementation.md) records the working stack and existing surfaces. P0/P1/P2 are product priorities, not implementation phase numbers.

For existing product capabilities, use the [NorthWrit product catalogue](NorthWrit-Product-Catalogue.md). The [capability matrix](../04-specs/NorthWrit-Capability-Matrix.md) maps these target requirements to current building blocks and remaining work.

**Status:** Proposed | **Version:** 2.0 | **Date:** November 3, 2026

---

## What is NorthWrit?

**NorthWrit** is a privacy-first legal AI workspace designed specifically for Canadian law firms and in-house legal departments. It unites Perplexity-style live, cited Canadian legal research with Harvey-class legal matter workflows—while ensuring confidential client work remains governed by strict, enforceable data privacy policies.

```
   ┌─────────────────────────────────────────────────────────────┐
   │                   NORTHWRIT MATTER WORKSPACE                │
   │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
   │  │ Assist (Q&A) │ │ Research     │ │ Review & Draft       │ │
   │  │ Pinpoint Cites│ │ CiteCheck    │ │ Folios & Playbooks   │ │
   │  └──────┬───────┘ └──────┬───────┘ └──────────┬───────────┘ │
   └─────────┼────────────────┼────────────────────┼─────────────┘
             └────────────────┼────────────────────┘
                              ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                  NORTHWRIT SHIELD (POLICY)                  │
   │   Privacy Modes: [ Local Only (P1) ] [ Hybrid ] [ Cloud ]   │
   │   • Model Gateway   • Redaction/Restoration  • Shield Log   │
   └──────────────────────────┬──────────────────────────────────┘
                              │
             ┌────────────────┴────────────────┐
             ▼                                 ▼
   ┌───────────────────┐             ┌───────────────────┐
   │ LOCAL ENVIRONMENT │             │ CANADIAN CLOUD    │
   │ Local Inference   │             │ Frontier Models   │
   │ (P1 Companion)    │             │ Public Case Law   │
   └───────────────────┘             └───────────────────┘
```

---

## The Four Core Strengths

1. **Unified Matter Workspace:** Documents, precedents, structured fact sheets, chat sessions, and reviewable work products (Folios) are co-located in secure matter silos. Data access is enforced before ingestion.
2. **Cited Legal Research:** Live answers over Canadian case law, provincial/federal statutes, and uploaded records. Every material statement carries a pinpoint citation; **CiteCheck** confirms whether the cited passage supports the proposition.
3. **Hybrid Privacy via NorthWrit Shield:** Firms configure matters as *Local Only*, *Hybrid*, or *Cloud*. Privacy and residency rules are hard barriers: if a cloud route is prohibited, the system blocks external calls rather than silently escalating. (At P0, Shield enforces Cloud and Hybrid policy with full outbound logging; validated Local Only inference ships with the Local Companion in P1.)
4. **Governed Extensibility:** Firm-specific knowledge, playbooks, and specialized workflows package into reusable **NorthWrit Packs** and MCP connectors, secured by strict least-privilege policies.

---

## Primary Release Deliverable: The Evidence-Linked Memo

Rather than deploying unconstrained autonomous agents, NorthWrit's initial release (P0) proves a single, critical workflow:
1. Create a Matter with defined jurisdiction and data policy.
2. Ingest private record files (PDF/DOCX) with text extraction.
3. Establish research parameters via **Bearings** (jurisdiction, timeframe, facts).
4. Run live research with sentence-level claim verification.
5. Generate an editable **Research Memo Folio** with explicit unknowns, version-bound reviewer approval states, and clean Word export.

---

## Release Scope Summary

| Tier | Focus | Scope | Deliverables |
|---|---|---|---|
| **P0 — Pilot** | Prove Trust & Accuracy | 38 Features | Matter workspace, Smart Upload, Assist Q&A, Research Engine with CiteCheck, Memo Folio, Shield Policy & Log, CI Bench |
| **P1 — Expansion**| Deepen Workflow Value | 39 Features | Review Grid (bulk tables), Playbook check & redline, Local Only inference companion, Agent Studio, SSO, OCR |
| **P2 — Platform** | Scale & Integration | 28 Features | Cross-matter intelligence, Outlook add-in, Pack Exchange, Mobile, Desktop offline mode |
