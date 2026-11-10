# Security & Privacy Overview

**Status:** Proposed Architecture Overview for Firm IT & Risk Teams | **Date:** November 3, 2026

This guide summarizes how Northwrit is designed to protect client confidentiality, enforce matter boundaries, and provide audit evidence for law firms and corporate legal departments. For full technical details, see [Security & Compliance](../06-technical/Northwrit_Security-Compliance.md) and [Hybrid AI Architecture](../06-technical/Northwrit_Hybrid-AI-Architecture.md).

---

## 1. Core Security Principles

1. **The Matter is the Boundary:** Every document, passage, vector, chat thread, Folio, and agent run is scoped to a single matter and tenant. Row-level security and pre-ranking index filters prevent cross-matter or cross-tenant leakage.
2. **One Governed Exit Path:** No component calls an external model, search API, or connector directly. Every call passes through **Northwrit Shield** and the **Model/Tool Gateways**.
3. **No Silent Escalation:** If a matter's policy forbids an external cloud route, the step stops and reports `blocked_by_policy`. It never silently switches models, regions, or scope.
4. **No Training on Customer Data:** Northwrit never trains models on customer data, and only model providers with contractual no-training terms may be enabled.

---

## 2. What Data Can Leave the Firm Boundary

Northwrit evaluates nine outbound data categories under the **Outbound Boundary** (SH04):
`prompt`, `research_query`, `excerpt`, `tool_parameter`, `embedding`, `screenshot`, `log`, `telemetry`, and `memory_sync`.

| Privacy Mode | What Stays Inside Boundary | What May Cross Boundary |
|---|---|---|
| **Local Only** (P1 Companion / Firm Server) | Documents, indexes, embeddings, model inference, tools, and logs. | **Nothing.** External network calls are blocked at the gateway and egress proxy. |
| **Hybrid** | Original documents, full indexes, and redaction restore maps. | Only permitted categories (such as minimal research queries or redacted excerpts) to firm-approved providers/regions. |
| **Cloud** | Isolated within the Canadian-region cloud tenant boundary. | Calls to firm-approved cloud model providers in permitted regions under contractual no-training terms. |

---

## 3. Auditability: Shield Log & Audit Trail

- **Shield Log (SH03):** Records every outbound cloud send and every blocked attempt *before* transmission completes—capturing user, matter, timestamp, destination provider/model/region, outbound data categories, redaction status, and policy rule ID. Sensitive payload text is never duplicated in logs.
- **Audit Trail (SA09):** An append-only, hash-chained record of all uploads, policy changes, role changes, review-state approvals, and exports.

---

## 4. Important Limitations & Honest Boundaries

- **Redaction Reduces Exposure, Not Anonymity:** Replacing names and dollar amounts (SH07, P1) reduces direct identifier exposure, but unique contextual facts can still identify a matter. High-risk matters should use *Local Only* mode.
- **CiteCheck vs. Citator:** CiteCheck verifies that a cited passage exists and supports the stated claim. It does not certify that a judicial decision has not been overturned on appeal unless licensed authority-treatment data is connected.
- **Compliance Status:** Northwrit is in the proposed specification stage. No SOC 2 or ISO 27001 certification is claimed until an independent audit is completed (SA15, P2).
