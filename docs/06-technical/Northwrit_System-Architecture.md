# System Architecture

> Requirements reconciliation — November 9, 2026. The [Workflow Contracts](../04-specs/Northwrit_Workflow-Contracts.md) govern review invalidation, export eligibility, lifecycle handoffs, and baseline release scope. Architectural approval does not establish implementation status.
## Components, flows and non-functional requirements

**Version:** 1.0 | **Date:** November 3, 2026 | **Status:** Proposed (nothing is built yet)

---

## 1. Purpose and scope

This document describes the proposed architecture of Northwrit, a privacy-first legal AI workspace for Canadian law firms and in-house teams. It implements the [Feature Specification](../04-specs/Northwrit_Feature-Spec.md); feature IDs (for example RS05, SH02) refer to that document. Related documents:

- [Hybrid AI Architecture](Northwrit_Hybrid-AI-Architecture.md): Shield, routing, outbound boundary
- [Data Model](Northwrit_Data-Model.md)
- [API Design](Northwrit_API-Design.md)
- [Security and Compliance](Northwrit_Security-Compliance.md)
- [Deployment Architecture](Northwrit_Deployment-Architecture.md)
- [Architecture Stack](Northwrit_Architecture-Stack.md)
- [Platform Layers & Surfaces](Northwrit_Platform-Layers-and-Surfaces.md): Cohere North private agentics × Harvey AI legal intelligence synthesis

Everything here is a proposal to be validated in the pilot. Where a choice is open, it is marked **Open**.

## 2. Architectural principles

| # | Principle | Source |
|---|---|---|
| 1 | The **matter** is the boundary for data, policy, audit and agent runs. | MT01, SA01 |
| 2 | Nothing calls a model, search provider or connector directly. Every call passes through the Model Gateway or the Tool Gateway, under the Processing Policy. | SH01, SH02 |
| 3 | Privacy and residency are hard constraints. Cost and latency optimise only among permitted routes. | SH06 |
| 4 | Retrieved content is untrusted. Model output cannot grant itself access. | Cross-cutting |
| 5 | A resolved citation is not a verified proposition. | RS05 |
| 6 | Failures are visible. No silent change of jurisdiction, source coverage, model location or scope. | Cross-cutting |
| 7 | A lawyer approves the exact payload before any external write. | AG03 |
| 8 | Logs record categories and identifiers, not duplicate sensitive payloads. | SH03, SA09 |

## 3. Logical architecture

```mermaid
flowchart TB
  subgraph Clients
    WEB[Web app]
    WORD[Word add-in - P1 DR05]
    COMP[Local companion - P1 SH05]
  end

  subgraph Control["Control plane (Canadian region)"]
    EDGE[API gateway and auth - SA03 SA10]
    ORCH[Workflow orchestrator - AG01 AG03]
    SHIELD[Shield: policy, router, boundary - SH01 SH04 SH06]
    MG[Model Gateway - SH02]
    TG[Tool Gateway: search, connectors, MCP - CN01 CN05]
    AUD[Audit and Shield Log - SA09 SH03]
  end

  subgraph Data["Data plane (Canadian region)"]
    ING[Ingestion workers - RV01 RV04]
    IDX[Search and retrieval index - SO01]
    CITE[Citation service: resolve and CiteCheck - RS05]
    ART[Artifact service: folios, review states - SO02 SO03]
    DB[(Relational store)]
    OBJ[(Object store, encrypted)]
    Q[[Job queue]]
  end

  subgraph External["External providers (governed)"]
    LLM[Model providers]
    SRCH[Legal and web sources]
    CONN[Document connectors]
  end

  WEB --> EDGE
  WORD --> EDGE
  COMP <--> EDGE
  EDGE --> ORCH
  ORCH --> SHIELD
  SHIELD --> MG
  SHIELD --> TG
  MG --> LLM
  TG --> SRCH
  TG --> CONN
  ORCH --> Q
  Q --> ING
  ING --> OBJ
  ING --> IDX
  ORCH --> IDX
  ORCH --> CITE
  ORCH --> ART
  ART --> DB
  CITE --> DB
  SHIELD --> AUD
  AUD --> DB
```

## 4. Components

| Component | Responsibility | Features |
|---|---|---|
| **Web app** | Matter workspace, chat, evidence viewer, folio editor, admin screens. Shows matter, jurisdiction, processing mode and review status at all times. | MT01, MT03, SO02, AS01 |
| **API gateway and auth** | TLS termination, MFA, SSO, session and token validation, rate limits and budgets, request logging. | SA03, SA06, SA10 |
| **Authorization service** | Tenant and matter checks, roles, ethical walls. Called at ingestion, retrieval, tool use and artifact access, not only at the edge. | SA01, SA07, SA11 |
| **Workflow orchestrator** | Runs bounded workflows as persisted steps. Handles cancellation, resumable failures, checkpoints and idempotency keys. | AG01, AG02, AG03 |
| **Shield** | Processing Policy evaluation, Smart Routing, redaction and restore, outbound boundary checks, Shield Log. See [Hybrid AI Architecture](Northwrit_Hybrid-AI-Architecture.md). | SH01 to SH07 |
| **Model Gateway** | One internal interface over cloud models and local runtimes. Applies Shield decisions, records usage. | SH02, CN01, AS02 |
| **Tool Gateway** | Same control for web search, legal-source retrieval, connectors, MCP and Pack tools. These are data-exit paths. | CN01 to CN06 |
| **Ingestion workers** | Virus scan, type check, text extraction, OCR (P1), chunking into passages, embeddings (via gateway), per-document status. | RV01, RV02, RV04 |
| **Search and retrieval** | Hybrid keyword and semantic search with permission filters applied in the query, not after. | SO01, RS03 |
| **Research service** | Bearings, source filters, retrieval from permitted sources, synthesis labelled by source type. | RS01 to RS04 |
| **Citation service** | Resolves citations to a source and location, then runs the support check. Assigns Verified, Unverified, Contradicted or Unavailable. | RS05 |
| **Artifact service** | Folios, versions, comparisons, review states, DOCX export (PDF and Excel at P1). | SO02 to SO06, RS06 |
| **Audit service** | Append-only audit events, exportable (export at P1). | SA09 |
| **Admin and policy service** | Model Policy, retention, budgets, roles, feature toggles. | SA05, SA08, SA13 |
| **Evaluation harness (internal)** | Northwrit Bench runs on every change to models, retrieval, prompts, tools or policy. Release gate. | QA01 |
| **Local companion (P1)** | Local parsing, indexing, encrypted storage, optional local inference. See Deployment. | SH05 |

## 5. Key flows

### 5.1 Upload and ingestion (RV01, RV02, MT01, SA01)

Access controls on the matter exist before any content is ingested. A failure names the document and the reason.

```mermaid
sequenceDiagram
  actor U as User
  participant W as Web app
  participant A as API gateway
  participant Z as Authorization
  participant O as Object store
  participant Q as Job queue
  participant I as Ingestion worker
  participant S as Shield and Model Gateway
  participant X as Index
  participant L as Audit

  U->>W: Select files for matter
  W->>A: POST /matters/{id}/documents
  A->>Z: Check matter write permission
  Z-->>A: Allowed
  A->>O: Store original (encrypted, Canadian region)
  A->>Q: Enqueue ingestion job (document id, version)
  A->>L: Audit: document.uploaded
  A-->>W: 202 Accepted, status = queued
  Q->>I: Job
  I->>I: Scan, detect type, extract text and locations
  alt Extraction fails or scan has no text layer
    I->>A: status = failed, reason (named)
    A-->>W: Status shows document and reason
  else Extraction succeeds
    I->>I: Split into passages with locator (page, paragraph)
    I->>S: Embed passages (category: matter content)
    S->>S: Policy check, route (Local Only blocks cloud embeddings)
    alt Route permitted
      S-->>I: Vectors
      I->>X: Index passages with matter and ACL tags
      I->>A: status = indexed
    else No eligible route
      S-->>I: blocked_by_policy
      I->>X: Index keyword only
      I->>A: status = indexed_keyword_only, gap named
    end
  end
  I->>L: Audit: document.ingested
  W->>A: Poll or stream status
```

### 5.2 Cited research with CiteCheck (RS01 to RS05)

```mermaid
sequenceDiagram
  actor U as User
  participant W as Web app
  participant R as Research service
  participant S as Shield
  participant T as Tool Gateway
  participant X as Index
  participant M as Model Gateway
  participant C as Citation service
  participant L as Shield Log and Audit

  U->>W: Ask legal question, choose source scope
  W->>R: Question, matter id
  R->>R: Bearings: jurisdiction, date, side, facts present?
  alt Missing items
    R-->>W: Ask user; do not assume
    U->>W: Provide items
  end
  R->>X: Retrieve matter passages (permission filtered)
  R->>S: Build outbound query (category: research query)
  S->>S: Policy and boundary check, redact if required
  alt Allowed
    S->>T: Search permitted sources
    T-->>R: Source passages with provenance
    S->>L: Shield Log entry
  else Blocked
    S-->>R: blocked_by_policy, offer local path or stop
  end
  R->>M: Synthesize with labelled evidence (retrieved text marked untrusted)
  M-->>R: Draft answer with claim-to-citation map
  R->>C: Resolve each citation
  C-->>R: Resolved, or Unavailable
  R->>C: Support check: does passage support claim?
  C->>M: Judge call (through gateway, same policy)
  M-->>C: Supports, contradicts or not shown
  C-->>R: Labels Verified, Unverified, Contradicted, Unavailable
  R-->>W: Answer, source panel, labels, coverage limits, unknowns
  R->>L: Audit: research.completed
```

CiteCheck never implies a citator (good-law) check. Authority treatment is a separate P2 capability (RS10) that depends on licensed data.

### 5.3 Memo draft, review and approve (AG01, RS06, SO02 to SO05, AG03)

```mermaid
sequenceDiagram
  actor A as Associate
  actor P as Reviewer (partner)
  participant O as Orchestrator
  participant R as Research service
  participant F as Artifact service
  participant C as Citation service
  participant L as Audit

  A->>O: Start research-to-memo workflow
  O->>O: Persist run and step records
  O->>R: Step 1 research (see 5.2)
  R-->>O: Evidence, labelled findings
  O->>F: Step 2 draft memo folio (version 1, state Draft)
  F->>C: Attach citations, run CiteCheck
  C-->>F: Labels
  F-->>A: Folio opens with uncited text marked
  A->>F: Edit directly or by asking
  F->>F: New version, citations stay linked
  A->>F: Submit for review
  F->>F: State = In review
  F->>L: Audit: artifact.submitted
  P->>F: Review
  alt Changes needed
    P->>F: Request changes with comments
    F->>F: State = Changes requested
    A->>F: Revise (new version)
  else Approve
    P->>F: Approve version N
    F->>F: State = Approved (bound to version N)
    F->>L: Audit: artifact.approved
  end
  note over F: Substantive edit or changed evidence after approval<br/>returns the artifact to Draft or In review
  A->>F: Export DOCX (SO05)
  F-->>A: File with citations, assumptions, scope, selected version
```

Cancellation stops new side effects and keeps completed step records. A failed step can be resumed without repeating completed steps.

### 5.4 Cloud send through Shield (SH01 to SH04, SH06, SH07)

```mermaid
sequenceDiagram
  participant Ag as Caller (research, draft, agent step)
  participant Sh as Shield
  participant Pol as Processing Policy
  participant Rt as Router
  participant Rd as Redaction
  participant Mg as Model Gateway
  participant Pr as Provider (cloud model)
  participant Lg as Shield Log

  Ag->>Sh: Request (matter, user, purpose, payload refs, capability)
  Sh->>Pol: Evaluate firm and matter policy (stricter wins)
  Pol-->>Sh: Mode, allowed providers and regions, categories
  Sh->>Rt: Classify request (confidential, mixed, public)
  Rt-->>Sh: Eligible routes (hard constraints applied)
  alt No eligible route
    Sh->>Lg: Record decision = blocked, rule id
    Sh-->>Ag: blocked_by_policy with permitted alternative or stop
  else Route eligible
    opt Redaction required by policy
      Sh->>Rd: Replace names, companies, amounts, addresses
      Rd-->>Sh: Redacted payload, restore map (kept in tenant store)
    end
    Sh->>Sh: Outbound boundary check on final payload
    Sh->>Lg: Write entry before send: who, category, model, region, rule, time
    Sh->>Mg: Send
    Mg->>Pr: Request (no-training terms, Canadian region where required)
    Pr-->>Mg: Response
    Mg->>Sh: Response and usage
    opt Redaction used
      Sh->>Sh: Restore originals inside tenant boundary
    end
    Sh-->>Ag: Response, model and provider identity
  end
```

## 6. Failure behaviour

| Situation | Behaviour |
|---|---|
| Ingestion fails | Status names the document and the reason; other documents continue. |
| Source unavailable | Partial result; the gap is named; coverage limits shown (RS03). |
| Cloud route prohibited | Offer a permitted local route (when SH05 is available) or stop that step; never escalate silently. |
| Provider outage | Fall back only to a route that passes the same policy; otherwise the step fails visibly and is resumable. |
| Citation cannot be resolved | Marked Unavailable; blocks nothing, but is flagged in export. |
| Policy changed mid-run | In-flight steps re-evaluate before the next send; the run records which policy version applied. |

## 7. Non-functional requirements (proposed targets)

These are engineering targets to calibrate in the pilot; they are not observed results.

| Area | Requirement | Related |
|---|---|---|
| **Tenant and matter isolation** | Zero cross-matter or cross-tenant disclosures in adversarial tests across retrieval, artifacts, memory and connector results. | SA01, SA11 |
| **Data residency** | Customer content and operational data stored and processed in Canadian regions where the firm selects it. Provider region is checked per call. | SA02, SA12 |
| **Local Only isolation** | Zero unapproved network egress in supported Local Only workflows, verified at the process and network boundary. | SH05 |
| **Citation resolution** | 100% of exported citations resolve or are marked unavailable. | RS05 |
| **Claim support** | At least 95% of sampled material claims supported on a lawyer-reviewed set; zero fabricated authorities. | QA01 |
| **Operational completion** | At least 95% completion on supported test tasks, excluding reported source outages; no silent partial success. | AG01 |
| **Latency** | Record p50 and p95 for upload-to-indexed, first answer token, and memo completion; set targets after measuring representative workloads. | SA14 |
| **Availability** | Target and measurement window to be set with design partners; planned maintenance windows announced. | |
| **Recovery** | RPO and RTO to be set per tier; see [Deployment Architecture](Northwrit_Deployment-Architecture.md). | |
| **Scalability** | Horizontal scaling of workers and retrieval; per-tenant rate limits and task budgets prevent noisy neighbours. | SA06 |
| **Auditability** | Every model call, agent step and change is an audit event; export at P1. | SA09 |
| **Accessibility** | WCAG 2.1 AA for core screens. | Cross-cutting |
| **Language** | Canadian spelling; English at P0; French is an open decision. | CU01 |
| **Portability** | Matter export as JSON plus original files. | Cross-cutting |
| **Maintainability** | Every change to models, retrieval, prompts, tools or policy reruns Northwrit Bench. | QA01 |

## 8. Phasing

| Phase | Architecture delivered |
|---|---|
| **P0** | Cloud workspace in a Canadian region; ingestion; hybrid search; Answer Engine; CiteCheck; folios and review states; fixed research-to-memo workflow (AG01); Shield policy, gateway, Shield Log and outbound boundary; isolation, encryption, audit, MFA. |
| **P1** | Local companion with validated Local Only subset; Smart Routing; Redact and Restore; OCR and email; Review Grid; playbooks; Agent Studio; one connector; SSO and SCIM; ethical walls. |
| **P2** | Desktop and offline mode; connector directory; MCP and enterprise APIs; Pack governance; routing optimisation. |

## 9. Open items

1. API implementation language and framework (see [Architecture Stack](Northwrit_Architecture-Stack.md)).
2. Web search provider for the Answer Engine.
3. Whether local inference is required at pilot launch or at P1.
4. Launch jurisdiction (Ontario is the working assumption).
5. French-language support at launch.
