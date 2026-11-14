# Security & Privacy Overview

**Status:** Proposed Architecture Overview for Firm IT & Risk Teams | **Date:** November 3, 2026

This guide summarizes how NorthWrit is designed to protect client confidentiality, enforce matter boundaries, and provide audit evidence for law firms and corporate legal departments. For full technical details, see [Security & Compliance](../06-technical/Northwrit_Security-Compliance.md) and [Hybrid AI Architecture](../06-technical/Northwrit_Hybrid-AI-Architecture.md).

## Current baseline and evidence

The current application uses Supabase Auth, API access helpers, API-owned database schema/migrations and S3-compatible storage. The [backend architecture](../engineering/backend-architecture.md) describes those boundaries. Existing code and passing tests are building blocks; they do not establish complete firm/matter isolation across every queued job, download or export. That acceptance work belongs to Phase 4.

Error reporting requires an operator-configured destination. Browser monitoring uses a same-origin tunnel; filtering and operational configuration are described in [observability](../engineering/observability.md). Provider and connector configuration still require review of actual destinations, credentials and data handling.

The principles, privacy-mode matrix and Shield controls below are target requirements. Local Only execution, Canadian residency, provider no-training terms, complete outbound enforcement and certification require deployment-specific evidence. This repository's CI results do not certify those properties. See the [current implementation](../06-technical/NorthWrit-Current-Implementation.md) and [implementation plan](../07-implementation/NorthWrit-Implementation-Plan.md) for delivered scope.

---

## 1. Target security principles

1. **The Matter is the Boundary:** Every document, passage, vector, chat thread, Folio, and agent run is scoped to a single matter and tenant. Row-level security and pre-ranking index filters prevent cross-matter or cross-tenant leakage.
2. **One Governed Exit Path:** No component calls an external model, search API, or connector directly. Every call passes through **NorthWrit Shield** and the **Model/Tool Gateways**.
3. **No Silent Escalation:** If a matter's policy forbids an external cloud route, the step stops and reports `blocked_by_policy`. It never silently switches models, regions, or scope.
4. **No Training on Customer Data:** NorthWrit never trains models on customer data, and only model providers with contractual no-training terms may be enabled.

---

## 2. Target outbound data policy

NorthWrit evaluates nine outbound data categories under the **Outbound Boundary** (SH04):
`prompt`, `research_query`, `excerpt`, `tool_parameter`, `embedding`, `screenshot`, `log`, `telemetry`, and `memory_sync`.

| Privacy Mode | What Stays Inside Boundary | What May Cross Boundary |
|---|---|---|
| **Local Only** (P1 Companion / Firm Server) | Documents, indexes, embeddings, model inference, tools, and logs. | **Nothing.** External network calls are blocked at the gateway and egress proxy. |
| **Hybrid** | Original documents, full indexes, and redaction restore maps. | Only permitted categories (such as minimal research queries or redacted excerpts) to firm-approved providers/regions. |
| **Cloud** | Isolated within the Canadian-region cloud tenant boundary. | Calls to firm-approved cloud model providers in permitted regions under contractual no-training terms. |

---

## 3. Target auditability: Shield Log & Audit Trail

- **Shield Log (SH03):** Records every outbound cloud send and every blocked attempt *before* transmission completes—capturing user, matter, timestamp, destination provider/model/region, outbound data categories, redaction status, and policy rule ID. Sensitive payload text is never duplicated in logs.
- **Audit Trail (SA09):** An append-only, hash-chained record of all uploads, policy changes, role changes, review-state approvals, and exports.

---

## 4. Important Limitations & Honest Boundaries

- **Redaction Reduces Exposure, Not Anonymity:** Replacing names and dollar amounts (SH07, P1) reduces direct identifier exposure, but unique contextual facts can still identify a matter. High-risk matters should use *Local Only* mode.
- **CiteCheck vs. Citator:** CiteCheck verifies that a cited passage exists and supports the stated claim. It does not certify that a judicial decision has not been overturned on appeal unless licensed authority-treatment data is connected.
- **Compliance Status:** NorthWrit has a merged development baseline; the governance and pilot requirements in this guide remain planned. No SOC 2 or ISO 27001 certification is claimed until an independent audit is completed (SA15, P2).
