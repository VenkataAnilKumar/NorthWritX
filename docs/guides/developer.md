# Developer Guide

**Version:** 2.0 | **Status:** Engineering Onboarding & Guardrails | **Date:** November 3, 2026

How the Northwrit Modular Monorepo is organized, the architectural invariants every pull request must uphold, and how to validate changes against **Northwrit Bench**.

---

## 1. Repository & Architecture Overview (v2.1 Modular Monorepo)

Northwrit is structured as a polyglot Modular Monorepo orchestrated by **Turborepo + `pnpm`** (TypeScript) and **`uv` Workspaces** (Python 3.12), plus **Cargo / Tauri 2.0** (Rust) for the P1 Local Companion (see [Repo Structure](../06-technical/Northwrit_Repo-Structure.md), [Architecture Stack](../06-technical/Northwrit_Architecture-Stack.md), and root [`AGENTS.md`](../../AGENTS.md)):

### `apps/` — User-Facing & Edge Applications (TypeScript / Rust)
- `apps/web`: Next.js 15 (React 19, TypeScript) Matter workspace, Evidence Drawer, Tiptap Folio editor, Review Grid (`P1`), Flow Builder (`P2`), and Control Centre.
- `apps/api`: Fastify REST + SSE Control Plane API (`/v1`), Matter RBAC, Folio version-bound state machine, and export endpoints.
- `apps/word-addin`: Microsoft Word Office.js task-pane add-in (`P1`, `DR05`).
- `apps/companion`: Tauri 2.0 + Rust + `llama.cpp` zero-egress Local Companion desktop service on `127.0.0.1:1337` (`P1`, `SH05`).

### `services/` — Python 3.12 AI & Document Microservices (`uv` Workspace)
- `services/shield-pii`: FastAPI + Microsoft Presidio bilingual Canadian PII redaction and reversible placeholder vault (copied & rebranded from `sim/apps/pii`).
- `services/ingest-worker`: Air-gapped document ingestion, layout parsing, and pinpoint page/paragraph chunking (copied & rebranded from `onyx/file_processing` + IBM Docling).
- `services/legal-engine`: LangGraph Research-to-Memo workflow orchestrator, McGill Guide 10th ed. citation parser, CanLII/statutory connectors, and 4-state CiteCheck verifier (`RS05`).
- `services/ocr-worker` (`P1`), `services/review-grid` (`P1`), and `services/bilingual-mt` (`P2`).

### `packages/` — Shared Internal TypeScript Libraries
- `packages/contracts`: Single source of truth (Zod schemas + OpenAPI + JSON Schema codegen for Python).
- `packages/db`: Drizzle ORM schema, migrations, and PostgreSQL 16 + `pgvector` Row-Level Security (`SET LOCAL northwrit.tenant_id`, `SET LOCAL northwrit.matter_id`).
- `packages/shield`: Deterministic Processing Policy engine (`local_only` > `redacted_cloud` > `approved_cloud`) and HMAC-SHA256 `ShieldDecision` token signer.
- `packages/gateway`: Sovereign Model & Tool Gateway (copied & rebranded from `kortix/apps/llm-gateway`).
- `packages/audit`: Content-free immutable Audit Trail & Shield Log writer (copied & rebranded from `sim/packages/audit`).
- `packages/auth` & `packages/authz`: OIDC/SAML, MFA, and 6 law-firm roles (copied & rebranded from `sim/packages/auth*`).
- `packages/ui`: Shared Northwrit Design System (`<CitationChip />`, `<ShieldPill />`, `<FolioStateBadge />`, `<BearingsModal />`, `<EvidenceDrawer />`).

### `packs/` & `bench/`
- `packs/`: Canadian Practice-Area Packs (`ontario-litigation`, `canadian-corporate-ma`, `canadian-privacy` — `P2`).
- `bench/`: **Northwrit Bench** evaluation suite and CI release gate (`QA01`).

---

## 2. Non-Negotiable Engineering Rules

Every pull request is checked against [`AGENTS.md`](../../AGENTS.md) and the [Implementation Checklist](../07-implementation/Northwrit_Implementation-Checklist.md) Definition of Done:

1. **Gateway-Only Calls (`SH02`):** Never call an LLM, embedding API, web search API, or external connector directly from `apps/*` or `services/*`. All external calls must pass through `@northwrit/gateway`, which verifies a cryptographically signed `ShieldDecision` token from `@northwrit/shield`.
2. **Pre-Query Database Isolation (`SA01`):** Every database and vector search query must run inside `withMatterContext(tenantId, matterId, ...)` in `@northwrit/db` so PostgreSQL Row-Level Security filters before ranking—never post-filter in application memory.
3. **Untrusted Content Delimitation:** All text extracted from uploaded documents or external web/legal sources must be passed into model requests inside `untrusted_segments[]` so prompt-injection defences apply.
4. **Payload-Free Logging (`SH03`, `SA09`):** Never log raw prompts, document passages, or user queries in application logs, error trackers, or `shield_events`. Log only UUID references, categories, token counts, and SHA-256 hashes.
5. **Version-Bound Approvals (`SO03`):** Any mutation to a Folio's `content_hash` must create a new `folio_versions` record and automatically reset `approved` state to `draft` in the same transaction.

---

## 3. Standard Development & Verification Commands

```powershell
# Start local sovereign infrastructure (PostgreSQL 16 + pgvector, Redis 7, MinIO)
pnpm infra:up

# Install & build TypeScript workspace
pnpm install
pnpm build
pnpm typecheck

# Run TypeScript & Python unit/integration test suites
pnpm test
uv run pytest

# Run Northwrit Bench evaluation harness (QA01)
uv run pytest bench
```

---

## 4. Running Northwrit Bench & Release Gates (`G1–G12`)

Before submitting a PR that touches models, prompts, retrieval, citations, or Shield policy:

1. **Unit & Contract Tests:** Confirm all `@northwrit/contracts`, `@northwrit/db`, `@northwrit/shield`, and `@northwrit/gateway` tests pass.
2. **Adversarial Isolation Suite (Gate G2):** Run cross-tenant and cross-matter access tests across search, Folios, memory, and connectors. Zero disclosures must pass.
3. **Gateway & Egress Suite (Gate G3):** Verify that disallowed outbound categories or unavailable routes return `blocked_by_policy` and write a blocked entry to `shield_events` (zero silent fallback).
4. **Northwrit Bench (Gate G1 & G4):** Run the benchmark harness against `bench/` to verify:
   - Citation resolution = 100% (resolved or marked `unavailable`)
   - Claim support ≥ 95% and fabricated authorities = 0
   - Unsupported-claim rate ≤ 2%
   - Issue recall ≥ 90%
