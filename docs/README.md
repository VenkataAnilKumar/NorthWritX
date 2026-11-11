# Northwrit Product Documentation

The [Open-Source References](03-market/Northwrit_Open-Source-References.md) register records MikeOSS as the application foundation and links to its source, workflows, and local setup.

**Northwrit** is a privacy-first legal AI workspace engineered specifically for Canadian law firms (10–300 lawyers, Ontario launch focus) and corporate in-house legal departments. It combines Perplexity-style live, cited Canadian legal research with Harvey-class legal workflows (matters, document review, drafting, playbooks, and agents), while ensuring confidential client data remains governed by strict, enforceable data privacy policies via **Northwrit Shield**.

---

## Complete Documentation Index

The index groups product specifications, technical designs, the current Mike OSS implementation plan, and operational guides.

| # | Document | What It Answers | Status |
|---|---|---|---|
| **01 Brand** | | | |
| 1 | [Brand Identity](01-brand/Northwrit_Brand-Identity.md) | Origin (*North* + *writ*), taglines, legal voice, Canadian spelling, naming rules, colour tokens | ✅ |
| **02 Product** | | | |
| 2 | [Product Overview](02-product/Northwrit_Product-Overview.md) | Executive one-pager, architecture diagram, four core strengths, initial release scope | ✅ |
| 3 | [Product Definition](02-product/Northwrit_Product-Definition.md) | Vision, problem, personas, principles, capabilities, features by release, KPIs, risks, glossary | ✅ |
| **03 Market** | | | |
| 4 | [Competitive Analysis](03-market/Northwrit_Competitive-Analysis.md) | Positioning vs. Harvey AI, Legora, CoCounsel, Clio, Spellbook, Alexi, Perplexity; moats & risks | ✅ |
| 5 | [Marketing & GTM Strategy](03-market/Northwrit_Marketing-and-GTM-Strategy.md) | Commercialization, pricing tiers, disbursement billing, 4-week pilot, practice-area packs | ✅ |
| **04 Specifications** | | | |
| 6 | [Feature Specification](04-specs/Northwrit_Feature-Spec.md) | **105 features** across 12 modules (38 P0, 39 P1, 28 P2), cross-cutting rules, source reconciliation | ✅ |
| 7 | [User Journeys](04-specs/Northwrit_User-Journeys.md) | End-to-end flows for research lawyers, contract counsel, admins, KM, and legal ops | ✅ |
| 8 | [User Stories](04-specs/Northwrit_User-Stories.md) | Stories with Given/When/Then acceptance criteria covering all 38 P0 features and key P1 flows | ✅ |
| **05 Design** | | | |
| 9 | [Design System](05-design/Northwrit_Design-System.md) | Colour tokens, typography, 4-state CiteCheck chips, review badges, Shield pills, WCAG 2.1 AA | ✅ |
| 10 | [UI Specification](05-design/Northwrit_UI-Spec.md) | Screen-by-screen behaviour: workspace, Bearings modal, Evidence drawer, Folio editor, Control Centre | ✅ |
| 11 | [Wireframes](05-design/Northwrit_Wireframes.md) | ASCII wireframes for the matter workspace, Bearings prompt, and Shield privacy drawer | ✅ |
| **06 Technical** | | | |
| 12 | [System Architecture](06-technical/Northwrit_System-Architecture.md) | Components, Mermaid sequence diagrams (ingestion, CiteCheck, review states, Shield), NFRs | ✅ |
| 13 | [Hybrid AI Architecture](06-technical/Northwrit_Hybrid-AI-Architecture.md) | Northwrit Shield: policy engine, Model Gateway, router, redaction, outbound boundary, Shield Log | ✅ |
| 14 | [Architecture Stack](06-technical/Northwrit_Architecture-Stack.md) | v2.0 Polyglot stack (TypeScript + Python `uv` + Rust Tauri), portability criteria, and resolved decisions | ✅ |
| 15 | [Data Model](06-technical/Northwrit_Data-Model.md) | PostgreSQL & vector schema, Mermaid ER diagram, row-level isolation, and retention rules | ✅ |
| 16 | [API Design](06-technical/Northwrit_API-Design.md) | REST resources, Model & Tool Gateway contracts, error envelopes (`blocked_by_policy`), MCP | ✅ |
| 17 | [Security & Compliance](06-technical/Northwrit_Security-Compliance.md) | Threat model (prompt injection, leakage), source rights records, LSO duties, PIPEDA & Law 25 | ✅ |
| 18 | [Deployment Architecture](06-technical/Northwrit_Deployment-Architecture.md) | Canadian-region cloud tier, Firm Server (Docker Compose), Local Companion, backups & observability | ✅ |
| 19 | [Repo Structure](06-technical/Northwrit_Repo-Structure.md) | v3.0 Sovereign Enterprise Monorepo blueprint (surfaces, microservices, packages, deploy, packs) | ✅ |
| 20 | [Open-Source Components](06-technical/Northwrit_Open-Source-Components.md) | v2.0 Reuse map covering local inventory (`sim`, `onyx`, `kortix`, `agno`) + `Jan.ai`, `LobeHub`, `MikeOSS`, `Docling` | ✅ |
| 21 | [Platform Layers & Surfaces](06-technical/Northwrit_Platform-Layers-and-Surfaces.md) | Architectural synthesis: Cohere North private agentics × Harvey AI legal intelligence (6 layers, 5 surfaces) | ✅ |
| **07 Implementation** | | | |
| 22 | [Mike OSS Implementation Plan](07-implementation/Northwrit_MikeOSS-Implementation-Plan.md) | Current roadmap: audit, rebrand, legal workspace, NorthWrit capabilities, integrations, and release | Planned |

---

## Operational Guides

| Guide | Audience |
|---|---|
| [User Guide](guides/user-guide.md) | Lawyers and legal staff using Northwrit in the pilot |
| [Security & Privacy Overview](guides/security.md) | A firm's IT, risk, or compliance team evaluating Northwrit |
| [Developer Guide](guides/developer.md) | Engineers building and testing Northwrit against Northwrit Bench |

---

## Key Operating Rules

1. **The Matter is the Boundary:** All documents, citations, chat contexts, and agent runs are strictly scoped to a matter.
2. **CiteCheck Discipline:** Resolving a link to CanLII or a statute is not proof of authority validity. Cites are marked *Verified*, *Unverified*, *Contradicted*, or *Unavailable*.
3. **No Silent Changes:** If a privacy route or legal source is unavailable, the system flags the gap or stops execution. It never silently escalates data to the cloud.
4. **Canadian-First Jurisprudence:** Grounded in Canadian citation formats (McGill Guide), provincial court hierarchies, and domestic privacy frameworks.
