# Northwrit Agent Builder Platform: Technical Architecture Specification

> Requirements reconciliation — November 9, 2026. The [Workflow Contracts](../04-specs/Northwrit_Workflow-Contracts.md) govern review invalidation, export eligibility, lifecycle handoffs, and baseline release scope. Architectural approval does not establish implementation status.
## Autonomous Legal Reasoning, Sovereign Discovery & Document Evidence Architecture

**Version:** 1.0 | **Date:** November 5, 2026 | **Status:** Approved Architectural Specification  
**Canonical Scope:** Deep Research Agent, Sovereign Web Search Agent, Document Evidence Agent, Agent Studio, and Open-Source Adaptation Layer

---

## 1. Executive Overview & System Purpose

The **Northwrit Agent Builder Platform** (**Agent Studio**) expands Northwrit from deterministic linear and DAG pipelines (**Flow Builder**, `@northwrit/flow-*`) into **autonomous, goal-directed multi-agent orchestration**. 

While Flow Builder executes fixed sequences (e.g., *Document Ingest $\rightarrow$ Shield Redaction $\rightarrow$ Review Grid Triage $\rightarrow$ Folio Generation*), the Agent Builder Platform enables legal practitioners and firm IT engineers to configure, evaluate, and deploy autonomous agents capable of non-linear reasoning, dynamic tool selection, iterative self-correction, and multi-source evidence synthesis.

All agent reasoning, tool dispatch, and generation cycles operate under the non-negotiable governance of **Northwrit Shield** (`SH01`–`SH07`), **PostgreSQL Row-Level Security Isolation** (`SA01`), **4-State CiteCheck Verification** (`RS05`), and **Canadian Data Sovereignty** (`ca-central-1`).

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              AGENT BUILDER STUDIO (WEB)                                │
│       Agent Designer Grid • Tool Binding Matrix • Prompt Tuning • Run Trail Sandbox    │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Agent Specification & Policy Bundle
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              NORTHWRIT SHIELD GATEWAY                                  │
│   Cryptographic ShieldDecision HMAC (SH02) • Canadian PII Pseudonymization (SH07)      │
│   Sovereign Region Lock (ca-central-1) • Zero Foreign Cloud Egress Policy (SH01)       │
└───────┬───────────────────────────────────┬────────────────────────────────────┬───────┘
        │                                   │                                    │
        ▼                                   ▼                                    ▼
┌───────────────────────┐       ┌───────────────────────┐        ┌───────────────────────┐
│     DEEP RESEARCH     │       │      WEB SEARCH       │        │       DOCUMENT        │
│      AGENT ENGINE     │       │    DISCOVERY AGENT    │        │    EVIDENCE AGENT     │
│  • Recursive CanLII   │       │  • Sovereign SearXNG  │        │  • Multi-File Graph   │
│  • Citator Graph Walk │       │  • Domain Whitelists  │        │  • Bates Coordinate   │
│  • McGill Memorandum  │       │  • Gazette & Statutes │        │  • Bounding Box RV01  │
└───────────────────────┘       └───────────────────────┘        └───────────────────────┘
```

---

## 2. The Three Pillar Agent Engines

### 2.1 Deep Research Agent Engine (`services/agent-service/research`)
Autonomous Canadian legal research demands recursive hypothesis generation, citator verification, and synthesis:
- **Goal Decomposition & Sub-Query Planning:** Deconstructs complex legal questions (e.g., *"Oppression remedy under s. 241 CBCA for minority shareholder dilution during restructuring"*) into distinct factual, statutory, and jurisprudence sub-queries.
- **Recursive Authority Discovery:** Queries Federal Court, Supreme Court of Canada, and provincial appellate bodies via CanLII and internal citation indexes.
- **Citator Graph Traversal:** Interrogates `services/legal-engine`'s `CanLIICitatorGraph` to track negative judicial treatment (*overruled*, *distinguished*, *questioned*) across appellate lineages.
- **Self-Reflective Legal Critic Loop:** An internal evaluative step verifies whether retrieved cases genuinely support the claimed legal proposition, preventing generative hallucinations prior to brief assembly.
- **McGill Guide Synthesis:** Generates formal research memoranda compliant with the 10th Edition of the Canadian Guide to Uniform Legal Citation.

### 2.2 Web Search & Sovereign Discovery Agent (`services/agent-service/search`)
Autonomous discovery without sacrificing data sovereignty or regulatory compliance:
- **Sovereign Domain Whitelisting:** Enforces hardware/network-level restrictions permitting queries exclusively to sanctioned Canadian legal portals:
  - Federal: `laws-lois.justice.gc.ca`, `scc-csc.ca`, `fct-cf.gc.ca`, `canlii.org`
  - Provincial: `soquij.qc.ca`, `ontariocourts.ca`, `bclaws.gov.bc.ca`, `albertacourts.ca`, `canlii.ca`
  - Regulatory: `osfi-bsif.gc.ca`, `osc.ca`, `competitionbureau.gc.ca`
- **Private SearXNG Sovereign Cluster:** Self-hosted search cluster residing in `ca-central-1` with no query logging, tracker cookies, or foreign IP leakage.
- **Live Regulatory Gazette Watcher:** Monitored agents track Bill amendments, statutory proclamations, and regulatory guidance updates, streaming diffs directly into the firm's Review Grid.

### 2.3 Document & Evidence Agent (`services/agent-service/document`)
Evidence-grounded multi-document cross-examination and fact-checking:
- **Multi-File Context Reasoning:** Ingests thousands of discovery pages, affidavits, witness transcripts, and contracts within a matter.
- **Bates Coordinate Grounding (`RV01`):** Every factual extraction or claim includes exact bounding-box coordinates `[page, x1, y1, x2, y2]` and Bates numbers linking directly to the PDF viewer in the web application.
- **Chronology & Contradiction Matrix:** Compares plaintiff vs. defendant witness statements to automatically surface factual conflicts, dates, and inconsistent testimony.

---

## 3. Monorepo Integration & Structural Architecture

The Agent Builder Platform integrates modularly across existing monorepo boundaries:

```
NorthWritX/
├── apps/
│   ├── web/
│   │   ├── src/app/
│   │   │   ├── agent-builder/                 # Visual Agent Studio UI
│   │   │   │   ├── page.tsx                   # Agent Builder Dashboard & Catalog
│   │   │   │   ├── [agentId]/page.tsx         # Visual Agent Configuration Studio
│   │   │   │   ├── components/                # Agent Designer Grid, Tool Matrix, Run Trail
│   │   │   │   └── sandbox/page.tsx           # Interactive Agent Execution Sandbox
│   │   │   └── flow-builder/                  # Planned Phase 5 Deterministic DAG Builder
│   └── desktop/                               # Tauri v2 Canadian Desktop Client
│
├── packages/
│   ├── agent-contracts/                       # Zod schemas for agent definitions, tools, traces
│   │   ├── src/
│   │   │   ├── agent-spec.ts                  # Agent specification & state schema
│   │   │   ├── tool-spec.ts                   # Tool manifest & parameter contracts
│   │   │   ├── memory-spec.ts                 # Scratchpad & episodic memory schemas
│   │   │   └── run-trail.ts                   # Step-by-step agent trajectory audit schemas
│   ├── agent-runtime/                         # TypeScript Agent Execution Harness
│   │   ├── src/
│   │   │   ├── agent-loop.ts                  # Multi-step ReAct / Plan-and-Solve engine
│   │   │   ├── tool-dispatcher.ts             # Sandboxed MCP and internal tool dispatcher
│   │   │   ├── memory-store.ts                # Matter-isolated agent state & scratchpad
│   │   │   └── shield-interceptor.ts          # Mandatory ShieldDecision validation (SH01/SH02)
│   ├── gateway/                               # Planned Phase 1 LLM Gateway with Region Lock
│   ├── shield/                                # Planned Phase 1 PII & Policy Gatekeeper
│   ├── db/                                    # Planned Phase 1 Drizzle Schema with Matter RLS
│   └── ui/                                    # Planned Phase 5 Authority Design Primitives
│
├── services/
│   ├── agent-service/                         # Python Autonomous Multi-Agent Reasoning Core
│   │   ├── pyproject.toml                     # uv workspace package definition
│   │   ├── server.py                          # FastAPI endpoint for agent orchestration & SSE
│   │   ├── app/
│   │   │   ├── research/                      # Deep Legal Research Reasoning Loop (Agno/Onyx)
│   │   │   │   ├── planner.py                 # Hypothesis decomposition
│   │   │   │   ├── recursive_search.py        # Iterative CanLII / Sovereign search
│   │   │   │   └── critic.py                  # Self-reflective authority verification
│   │   │   ├── search/                        # Sovereign Web Search Agent
│   │   │   │   ├── searxng_client.py          # Private Canadian SearXNG client
│   │   │   │   └── domain_whitelist.py        # Strict sovereign URL boundaries
│   │   │   ├── document/                      # Document Grounding & Evidence Agent
│   │   │   │   ├── evidence_cross_examiner.py # Factual contradiction finder
│   │   │   │   └── bates_grounder.py          # Bounding-box link resolver (RV01)
│   │   │   └── tools/                         # Built-in agent tool registry
│   │   └── tests/                             # Pytest agent reasoning and tool tests
│   ├── shield-pii/                            # Existing Presidio + Canadian PII Recognizers
│   ├── legal-engine/                          # Existing CanLII Citator Graph & CiteCheck
│   ├── review-grid/                           # Existing Document Triage & Extraction
│   ├── ingest-worker/                         # Existing File Ingestion & Parsing
│   └── crawler/                               # Existing Sovereign Canadian Legal Scraper
│
└── packs/
    └── agents/                                # Predefined Turnkey Legal Agent Bundles
        ├── legal-researcher/                  # CanLII & McGill Memorandum Specialist
        │   ├── agent.json                     # System prompts, tools, memory config
        │   └── eval-suite.json                # Standard benchmark scenarios
        ├── contract-analyzer/                 # Commercial Agreement Playbook Auditor
        ├── factum-drafter/                    # Superior Court Factum Drafting Specialist
        ├── discovery-examiner/                # Witness Deposition & Transcript Interrogator
        ├── privilege-screener/                # Canadian Solicitor-Client Privilege Classifier
        └── regulatory-monitor/                # Sovereign Gazette & Statute Amendment Watcher
```

---

## 4. Open-Source Adaptation & Copy-and-Rebrand Protocol

In accordance with `AGENTS.md` Rule 2, upstream components are copied recursively, rebranded, and augmented with Northwrit's Canadian legal domain layer:

| Target Northwrit Module | Physical Source to Copy (`Copy-Item -Recurse`) | Upstream Lineage | Rebranding & Legal Extension Required |
|---|---|---|---|
| **`services/agent-service/app/research/`** | `V:\AI Engineer\Agent Platforms\Open Sources\agno\libs\agno\agno\agent\*`<br>`V:\AI Engineer\Agent Platforms\Open Sources\agno\libs\agno\agno\reasoning\*`<br>`V:\AI Engineer\Agent Platforms\Open Sources\onyx\backend\onyx\deep_research\*` | `Agno Agent Engine` + `Onyx Deep Research` | Rebrand namespace `agno.*` and `onyx.deep_research.*` $\rightarrow$ `northwrit_agent.research.*`. Preserve full recursive planning, step reflection, and loop management. Extend with CanLII Citator Graph traversal and McGill Guide 10th Ed memorandum drafting. |
| **`services/agent-service/app/tools/`** | `V:\AI Engineer\Agent Platforms\Open Sources\agno\libs\agno\agno\tools\*`<br>`V:\AI Engineer\Agent Platforms\Open Sources\onyx\backend\onyx\tools\*` | `Agno Tool Registry` + `Onyx Connector Tools` | Rebrand to `northwrit_agent.tools.*`. Integrate with Northwrit MCP server (`search_matter_passages`, `verify_citation`, `redact_pii`). Enforce cryptographic `ShieldDecision` token verification on all tool executions. |
| **`packages/agent-runtime/`** | `V:\AI Engineer\Agent Platforms\Open Sources\kortix\apps\kortix-sandbox-agent-server\src\*` | `Kortix Sandbox Agent Server` | Rebrand `@kortix/*` $\rightarrow$ `@northwrit/agent-runtime`. Preserve memory budgeting, token ceiling protection, and streaming trace collectors. Embed mandatory `ca-central-1` sovereignty check and HMAC verification. |
| **`services/agent-service/app/document/`** | `V:\AI Engineer\Agent Platforms\Open Sources\onyx\backend\onyx\chat\*`<br>`V:\AI Engineer\Agent Platforms\Open Sources\onyx\backend\onyx\document_index\*` | `Onyx Grounded Document Index` | Rebrand to `northwrit_agent.document.*`. Wire to Northwrit Bates locator (`RV01`) and SHA-256 version lineage (`RV02`). Guarantee zero cloud egress on document queries. |
| **`apps/web/src/app/agent-builder/`** | `V:\AI Engineer\Agent Platforms\Open Sources\sim\packages\workflow-renderer\*`<br>`V:\AI Engineer\Agent Platforms\Open Sources\sim\apps\sim\components\*` | `Sim Workflow Studio & UI` | Rebrand `@sim/*` $\rightarrow$ `@northwrit/agent-builder-ui`. Standardize with Northwrit Authority Blue (`#1D4ED8`), Deep Slate (`#0F172A`), and Paper Warm (`#FAF9F5`). Implement Agent Tool Binding Matrix, Run Trail visualizer, and live Sandbox prompt tester. (Prohibited terms strictly excluded). |
| **`packs/agents/`** | `V:\AI Engineer\Agent Platforms\Open Sources\minimax-skills\skills\*` | `Minimax Specialized Skills Engine` | Adapt modular skill and persona schemas into Northwrit's 6 turnkey sovereign legal agents (`legal-researcher`, `contract-analyzer`, etc.). |

---

## 5. Architectural Invariants & Failure-Mode Defences

### 5.1 Maximum Turn & Cumulative Token Budget Ceiling (`AR01`)
- Every agent run executes under a mandatory step ceiling: `max_turns = 12` (configurable up to `25` only with Partner role override `SA04`).
- Memory and token usage are verified against admission quotas in `@northwrit/gateway`. Cumulative tokens exceeding `150,000` trigger an immediate `budget_exceeded` event and generate an interim synthesis.
- If three successive iterations yield $\ge 80\%$ Jaccard similarity across retrieved authority titles, the internal critic terminates the search phase.

### 5.2 Bi-Directional PII Pseudonymization in Working Scratchpads (`AR02`)
- Every prompt token dispatched to an LLM provider and every tool response stored in the agent's scratchpad (`agent_run_steps`) passes through `services/shield-pii`.
- Client PII (Canadian SINs, counsel IDs, court file numbers, postal codes) is replaced with stable session tokens (`<CA_SIN_1>`, `<PERSON_1>`).
- De-pseudonymization is strictly confined to the final client presentation layer inside Canadian sovereign boundaries (`ca-central-1`).

### 5.3 4-State CiteCheck Grounding Discipline (`AR03`, `RS05`)
- Generative legal claims cannot be marked as binding or authoritative without validation against `services/legal-engine`'s `CiteCheckVerifier` and `CanLIICitatorGraph`.
- Every citation output is classified into one of four deterministic states: `verified`, `unverified`, `contradicted`, or `unavailable`.
- Negative judicial treatments (*overruled*, *reversed*, *distinguished*) produce mandatory appellate warning banners in the final deliverable.

### 5.4 Hardware Egress & Sovereign Whitelisting (`AR04`)
- Sovereign web search agents are forbidden from executing direct external DNS or raw socket calls.
- All web lookups route through the internal `ca-central-1` SearXNG cluster.
- HTML scraping is strictly gated to approved Canadian federal, provincial, and regulatory hostnames.

### 5.5 Matter Context & Database RLS Isolation (`AR05`, `SA01`)
- Agent definitions, run logs, and working scratchpads are persisted with PostgreSQL Row-Level Security.
- Every transactional query sets:
  ```sql
  SET LOCAL northwrit.tenant_id = '<tenant_id>';
  SET LOCAL northwrit.matter_id = '<matter_id>';
  ```
- Vector memory namespaces are physically partitioned by tenant and matter IDs: `namespace = "${tenant_id}:${matter_id}"`.

---

## 6. Predefined Sovereign Legal Agent Catalog

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PREDEFINED CANADIAN LEGAL AGENT CATALOG                         │
├───────────────────────┬───────────────────────┬────────────────────────────────────────┤
│ Agent Name            │ Primary Domain        │ Core Capabilities & Sovereign Tools    │
├───────────────────────┼───────────────────────┼────────────────────────────────────────┤
│ 1. legal-researcher   │ Appellate & Civil     │ • CanLII full-text search              │
│                       │ Litigation Research   │ • Appellate citator graph verification │
│                       │                       │ • McGill Guide 10th Ed legal memos     │
├───────────────────────┼───────────────────────┼────────────────────────────────────────┤
│ 2. contract-analyzer  │ Corporate / M&A &     │ • Commercial lease & M&A risk audit    │
│                       │ Commercial Agreements │ • Ontario Playbook deviation analysis  │
│                       │                       │ • Fiduciary liability clause detection │
├───────────────────────┼───────────────────────┼────────────────────────────────────────┤
│ 3. factum-drafter     │ Court of Appeal / SCJ │ • Rules of Civil Procedure Rule 4 / 61 │
│                       │ Appellate Submissions │ • Issue, Law, Argument formulation     │
│                       │                       │ • Automated Pinpoint Table of Auth.    │
├───────────────────────┼───────────────────────┼────────────────────────────────────────┤
│ 4. discovery-examiner │ Commercial Litigation │ • Multi-witness deposition triage      │
│                       │ Examinations & Trial  │ • Factual cross-contradiction detection│
│                       │                       │ • Bates-stamped evidence chronology    │
├───────────────────────┼───────────────────────┼────────────────────────────────────────┤
│ 5. privilege-screener │ Large-Scale Document  │ • Solicitor-client privilege testing   │
│                       │ Review & Ingestion    │ • Litigation privilege common law rules│
│                       │                       │ • Redaction log generation with reason │
├───────────────────────┼───────────────────────┼────────────────────────────────────────┤
│ 6. regulatory-monitor │ Sovereign Compliance  │ • OSFI, OSC, Competition Bureau scans  │
│                       │ & Statutory Watch     │ • Bill C-27 / PIPEDA privacy audits    │
│                       │                       │ • Gazette proclamations diff stream    │
└───────────────────────┴───────────────────────┴────────────────────────────────────────┘
```

---

## 7. Mandatory Terminology & Language Standards

### 7.1 Prohibited Terms
Under no circumstances may competitor terminology appear in UI labels, route segments, component names, or documentation:
- ~~`Vault`~~ $\rightarrow$ **`Matter`** / **`Shield Vault`**
- ~~`Spaces`~~ $\rightarrow$ **`Matter Workspace`**
- ~~`Pages`~~ $\rightarrow$ **`Folio`**
- ~~`Labs`~~ $\rightarrow$ **`Agent Studio`** or **`Agent Builder`**
- ~~`Canvas`~~ $\rightarrow$ **`Flow Builder`** or **`Agent Grid`**
- ~~`Copilot`~~ $\rightarrow$ **`Assistant`** or **`Agent`**

### 7.2 Canadian English Spelling Standard
All user-facing copy, code comments, and documentation must adhere to Canadian English conventions:
- `centre` (not *center*)
- `colour` (not *color*)
- `licence` as noun, `license` as verb
- `behaviour` (not *behavior*)
- `rigour` (not *rigor*)
- `defences` (not *defenses*)
- `analyse` / `analysing` (not *analyze*)
