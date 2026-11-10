# Architecture Stack
## Definitive Technology Choices, Polyglot Runtime & Open Procurement Decisions

**Version:** 2.0 | **Date:** November 3, 2026 | **Status:** Approved Target Stack

---

## 1. Selection Criteria

| Criterion | Why It Matters |
|---|---|
| **Canadian-region availability** | Storage and processing remain in Canada (`ca-central-1` / `canadaeast`) where the firm requires it (SA02, SA12). |
| **Portability across all 3 tiers** | The Firm-Server tier (Tier 2) must run the exact same container images without public cloud dependencies (see [Deployment Architecture](Northwrit_Deployment-Architecture.md)). |
| **Row-level isolation** | Tenant and matter isolation enforced directly inside PostgreSQL via Row-Level Security (SA01). |
| **Auditability and simplicity** | Fewer external stateful dependencies mean a smaller attack surface and a faster law-firm security review. |
| **Replaceable AI providers** | Model Gateway and Tool Gateway adapters can be swapped per firm policy without touching application code (SH02, CN01). |
| **Proven open-source foundations** | Reuses battle-tested components from `sim`, `onyx`, `kortix`, `Docling`, `Presidio`, and `Jan.ai`. |

---

## 2. Definitive Polyglot Stack (v2.0)

| Layer | Selected Technology | Why It Fits Northwrit | Proven Reference / Upstream |
|---|---|---|---|
| **Monorepo Build & Orchestration** | **Turborepo + `pnpm` Catalogs** (TS) & **`uv` Workspaces** (Python) | Affected-only incremental builds; unified lockfiles per language; clean boundary enforcement across Phases 1–3. | `sim`, `kortix`, `onyx` |
| **Web Client (`apps/web`)** | **Next.js 15 (App Router) + React 19 + Tailwind CSS v4 + Radix UI** | Responsive split-screen layout (Matter Chat + Folio Editor + Evidence Drawer) with WCAG 2.1 AA accessibility. | `LobeHub`, `MikeOSS` |
| **Folio Editor (`packages/ui`)** | **Tiptap (ProseMirror)** | Structured JSON document model supporting custom `<CitationBadge />` nodes, version diffing, and `.docx` export (SO02–SO05). | `MikeOSS` |
| **Word Add-in (`apps/word-addin`, P1)** | **Office.js + React + Shared `@northwrit/contracts`** | Runs inside Microsoft Word task pane for clause drafting, playbook comparison, and tracked-changes redlining (DR05). | `open-legal-products/mike` |
| **Core Control API (`apps/api`)** | **Fastify (TypeScript / Node 22) + Zod + OpenAPI** | High-throughput REST + SSE server sharing exact Zod schemas (`packages/contracts`) with `apps/web` and `packages/db`. | `sim`, `kortix` |
| **Workflow Orchestration (`services/legal-engine`)** | **LangGraph (Python) + Redis/BullMQ** | Durable state persistence, step-level checkpoints, cancellation, and human-in-the-loop approval gates (AG01–AG03). | `langchain-ai/langgraph`, `agno` |
| **Relational, FTS & Vector Store (`packages/db`)** | **PostgreSQL 16 + `pgvector` + Drizzle ORM** | **One database first:** relational tables, BM25 full-text search, and vector embeddings enforced by PostgreSQL Row-Level Security (`tenant_id`, `matter_id`). | `sim`, `onyx` |
| **Object Store** | **S3-Compatible Storage** (Cloud S3 in `ca-central-1`; **MinIO** in Firm-Server tier) | Stores AES-256 encrypted original uploads and exported deliverables behind a single S3 API. | `onyx` |
| **PII & Redaction (`services/shield-pii`)** | **FastAPI + Microsoft Presidio + spaCy (`en` + `fr`)** | Warm-loaded NER analyzer and anonymizer with reversible placeholder vault (`[PERSON_1]`, `[COURT_FILE_1]`) for `SH07`. | `sim/apps/pii` (`microsoft/presidio`) |
| **Model & Tool Gateway (`packages/gateway`)** | **TypeScript Sovereign Gateway + LiteLLM Compatibility** | Enforces signed `ShieldDecision` tokens, Canadian regional endpoints, token budgets, and zero-retention headers (SH02, SH06). | `kortix/apps/llm-gateway`, `LiteLLM` |
| **Audit & Shield Log (`packages/audit`)** | **Immutable Append-Only Audit Writer** | Content-free structured audit logs and user-facing Shield Logs with JSON/CSV export for LSO compliance (SH03, SA09). | `sim/packages/audit` |
| **Document Parsing (`services/ingest-worker`)** | **IBM Docling + Onyx File Processing** | Air-gapped container (`network_mode: internal`) extracting hierarchical sections, tables, and page/paragraph coordinates (RV01, RV02). | `IBM/docling`, `onyx/file_processing` |
| **Citation & CiteCheck (`services/legal-engine`)** | **McGill Guide 10th Ed. Parser + `eyecite` + CanLII Client** | Deterministic 4-state authority validation (`Verified`, `Unverified`, `Contradicted`, `Unavailable`) (RS05). | `freelawproject/eyecite`, `call-canlii` |
| **OCR Engine (`services/ocr-worker`, P1)** | **Surya OCR / Tesseract (Self-Hosted)** | Processes scanned litigation productions inside the tenant boundary so scanned PDFs never egress to third-party OCR clouds (RV04). | `VikParuchuri/surya` |
| **Local Companion (`apps/companion`, P1)** | **Tauri 2.0 (Rust) + `llama.cpp` (`127.0.0.1:1337`)** | Lightweight desktop binary with hardware-accelerated local inference (CUDA/Metal) and permission-scoped local folders (SH05). | `janhq/jan` (Jan.ai) |
| **Observability** | **OpenTelemetry** (Metrics, Traces & Content-Free Logs) | Strictly scrubs matter text, prompts, and file names before emitting telemetry (SH04). | `kortix/llm-gateway/observability` |

---

## 3. Architectural Decisions Resolved in v2.0

| Previous Open Question (v1.0) | v2.0 Resolution | Why |
|---|---|---|
| **API Language (TypeScript vs. Python)** | **Dual-Runtime Polyglot Monorepo:** TypeScript (`Fastify`) for the Control Plane API (`apps/api`) + Python (`FastAPI`/Workers) for AI, Redaction & Parsing (`services/*`). | Gives the web workspace and Word add-in 100% shared TypeScript/Zod schemas while keeping Docling, Presidio, Eyecite, and LangGraph native in Python. |
| **Monorepo vs. Multi-Repo** | **Modular Monorepo** (`pnpm` + Turborepo + `uv` workspace) with independent Docker containers per service. | Atomic cross-stack PRs and zero schema drift at build time; independent horizontal scaling per microservice at runtime. |
| **Workflow Orchestrator** | **LangGraph** backed by PostgreSQL state checkpoints and **Redis / BullMQ** job queues. | Native support for resumable steps, Run Trail visibility (`AG02`), and human approval checkpoints (`AG03`). |
| **Local Companion Architecture (P1)** | **Tauri 2.0 (Rust) + `llama.cpp`** modelled on **Jan.ai**. | Avoids Electron bloat; provides an embedded OpenAI-compatible loopback server (`127.0.0.1:1337`) for zero-egress inference. |

---

## 4. Remaining Commercial & Procurement Confirmations (Discovery Stage)

| Item | Action Required | Gate |
|---|---|---|
| **CanLII & Statutory Source Rights** | Execute written API licence agreement with CanLII and populate `source_rights` table (`SA13`). | Gate G1 |
| **Canadian Cloud LLM Contracts** | Confirm written zero-data-retention and no-training DPA terms for Canadian-region endpoints (`ca-central-1` / `canadaeast`). | Gate G1 |
| **Local Only Hardware & Model Profile (P1)** | Benchmark candidate open-weight models (e.g., Llama-3.3-70B-Instruct Q4 / Qwen-2.5-32B) on Northwrit Bench prior to P1 release. | Gate G9 |

---

## 5. Things the Stack Deliberately Avoids

* Calling model or search providers from the browser or from any module other than `packages/gateway`.
* Executing `packages/gateway` calls without a cryptographically signed `ShieldDecision` token from `packages/shield`.
* Allowing outbound network access from document parsing or OCR worker containers (`services/ingest-worker`, `services/ocr-worker`).
* Storing raw matter prompts, passages, or PII in application logs, dead-letter queues, or OpenTelemetry traces.
