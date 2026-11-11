# Northwrit Product Documentation

The [Open-Source References](03-market/Northwrit_Open-Source-References.md) register records MikeOSS as the application foundation and links to its source, workflows, and local setup.

The [implementation plan](07-implementation/NorthWrit-Implementation-Plan.md) governs current delivery. Use the [repository ownership map](06-technical/NorthWrit-Repository-Ownership.md) for documentation authority. Product specifications describe target behaviour; document availability and check marks below do not establish that a feature or security guarantee is implemented or validated.

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
| 9 | [Application Design System](../docs/engineering/design-system.md) | Implemented tokens, shared primitives and accessibility conventions | Engineering guide |
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
| 19 | [Repository Ownership](06-technical/NorthWrit-Repository-Ownership.md) | Current layout, dependency boundaries and documentation authority | Accepted structure |
| 20 | [Source Audit](07-implementation/NorthWrit-Source-Audit.md) | Pinned Mike OSS architecture, candidate building blocks and gaps | Static review |
| 21 | [Platform Layers & Surfaces](06-technical/Northwrit_Platform-Layers-and-Surfaces.md) | Architectural synthesis: Cohere North private agentics × Harvey AI legal intelligence (6 layers, 5 surfaces) | ✅ |
| **07 Implementation** | | | |
| 22 | [NorthWrit Implementation Plan](07-implementation/NorthWrit-Implementation-Plan.md) | Current roadmap: audit, rebrand, legal workspace, NorthWrit capabilities, integrations, and release | Planned |
| 23 | [Feature Disposition](07-implementation/NorthWrit-Feature-Disposition.md) | Reuse, adapt, build and defer decisions for the feature backlog | Planning input |
| 24 | [CI Inventory](07-implementation/NorthWrit-CI-Inventory.md) | Active repository checks and imported workflow gaps | Engineering inventory |
| 25 | [Phase 4 Extension Map](07-implementation/NorthWrit-Phase-4-Extension-Map.md) | Existing owners for matters, access, evidence, jobs, reviews and exports | Implementation map |
| 26 | [Repository Verification](07-implementation/NorthWrit-Repository-Verification.md) | Local root-command, build, type and regression results; warnings and limits | Recorded checks |

The [older v3 repository blueprint](06-technical/Northwrit_Repo-Structure.md) remains historical context. It does not replace the accepted current structure.

---

## Operational Guides

| Guide | Audience |
|---|---|
| [User Guide](guides/user-guide.md) | Lawyers and legal staff using Northwrit in the pilot |
| [Security & Privacy Overview](guides/security.md) | A firm's IT, risk, or compliance team evaluating Northwrit |
| [Developer Guide](guides/developer.md) | Engineers setting up and checking the active NorthWrit application |

---

## Key Operating Rules

1. **The Matter is the Boundary:** All documents, citations, chat contexts, and agent runs are strictly scoped to a matter.
2. **CiteCheck Discipline:** Resolving a link to CanLII or a statute is not proof of authority validity. Cites are marked *Verified*, *Unverified*, *Contradicted*, or *Unavailable*.
3. **No Silent Changes:** If a privacy route or legal source is unavailable, the system flags the gap or stops execution. It never silently escalates data to the cloud.
4. **Canadian-First Jurisprudence:** Grounded in Canadian citation formats (McGill Guide), provincial court hierarchies, and domestic privacy frameworks.

## Expanded repository migration

- [Migration verification](07-implementation/NorthWrit-Migration-Verification.md): local check results, inherited failures and release limits.
- [Path and provenance map](07-implementation/NorthWrit-Migration-Paths.json): old-to-new locations for imported source and supporting files.
- [ADR 0002](decisions/0002-expanded-repository-structure.md): accepted expanded layout before Phase 4.
- [ADR 0003](decisions/0003-npm-root-workspace.md): root npm workspace and NorthWrit package identities.
- [Workspace verification](07-implementation/NorthWrit-Workspace-Verification.md): consolidated installs, checks and known limits.
