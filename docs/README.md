# NorthWrit documentation

NorthWrit is a legal AI workspace being developed for Canadian law firms and in-house teams. The application baseline, repository migration and npm workspace are merged. Phase 4 has not started; the planned Canadian research, CiteCheck, Shield and approval workflows remain future delivery work.

## Start here

| Need | Read |
|---|---|
| Install and run | [Root README](../README.md), [developer guide](guides/developer.md), [local development](engineering/local-development.md) |
| Use current product features | [Product catalogue](02-product/NorthWrit-Product-Catalogue.md), [user guide](guides/user-guide.md), [administrator guide](guides/administrator.md) |
| Understand what exists today | [Current implementation and stack](06-technical/NorthWrit-Current-Implementation.md), [system flows](06-technical/NorthWrit-System-Flows.md), [engineering index](engineering/README.md) |
| See phases and next work | [Implementation plan](07-implementation/NorthWrit-Implementation-Plan.md), [Detailed phase delivery and gates](07-implementation/NorthWrit-Phased-Delivery-Plan.md), [Phase 2B architecture principles](07-implementation/NorthWrit-Phase-2B-Architecture-Principles.md), [Phase 2C experience, AI and evidence contracts](07-implementation/NorthWrit-Phase-2C-Experience-AI-Evidence-Contracts.md), [Phase 2D delivery and verification plan](07-implementation/NorthWrit-Phase-2D-Delivery-Verification-Plan.md), [Cross-platform feature backlog](07-implementation/NorthWrit-Cross-Platform-Feature-Backlog.md), [Phase 4 extension map](07-implementation/NorthWrit-Phase-4-Extension-Map.md), [4A Matter contracts and fixtures](07-implementation/NorthWrit-Phase-4A-Matter-Contracts-Fixtures.md), [4B metadata verification](07-implementation/NorthWrit-Phase-4B-Metadata-Verification.md), [4C Overview/settings verification](07-implementation/NorthWrit-Phase-4C-Overview-Verification.md) |
| Find code/document ownership | [Ownership map](06-technical/NorthWrit-Repository-Ownership.md), [ADRs](#architecture-decisions) |
| Assess checks and limits | [CI inventory](07-implementation/NorthWrit-CI-Inventory.md), [configuration verification](07-implementation/NorthWrit-Configuration-Verification.md) |
| Compare existing capabilities with requirements | [105-feature capability matrix](04-specs/NorthWrit-Capability-Matrix.md), [documentation coverage](07-implementation/NorthWrit-Documentation-Coverage.md) |
| Review intended legal workflows | [Product overview](02-product/Northwrit_Product-Overview.md), [workflow contracts](04-specs/Northwrit_Workflow-Contracts.md) |

## How to read these documents

The implementation plan governs delivery order. Current source, tests and engineering guides describe the implemented baseline. Product specifications describe requirements; design approval and a document's presence do not establish implementation or legal/security guarantees. P0/P1/P2 are product priorities, separate from implementation phases 1–7. Phase 2 is restored as Product and Architecture Foundation; its remaining decisions and review gates are recorded in the implementation plan.

Historical audits, migration evidence and upstream files retain their original observations and attribution. The earlier polyglot stack and v3 layout proposals do not override the accepted npm workspace or working stack. The [ownership map](06-technical/NorthWrit-Repository-Ownership.md#which-documentation-governs-a-change) defines documentation authority.

## Product, requirements and design

The product catalogue describes existing capabilities. The specifications, designs and market documents describe target scope or research inputs, not shipped feature checklists.

| Area | Documents |
|---|---|
| Brand | [Identity and naming](01-brand/Northwrit_Brand-Identity.md) |
| Current product | [Capability catalogue](02-product/NorthWrit-Product-Catalogue.md), [105-feature coverage matrix](04-specs/NorthWrit-Capability-Matrix.md) |
| Product targets | [Overview](02-product/Northwrit_Product-Overview.md), [definition](02-product/Northwrit_Product-Definition.md) |
| Market research | [Harvey current implementation map](03-market/NorthWrit-Harvey-Implementation-Map.md), [Harvey, Filevine and Clio comparison](03-market/NorthWrit-Harvey-Filevine-Clio-Comparison.md), [Competitive analysis](03-market/Northwrit_Competitive-Analysis.md), [Harvey inventory](03-market/Harvey_Product-Feature-Inventory.md), [feature comparison](03-market/Northwrit_vs_Harvey_Feature-Comparison.md), [source references](03-market/Northwrit_Open-Source-References.md) |
| Requirements | [105-feature specification](04-specs/Northwrit_Feature-Spec.md), [user journeys](04-specs/Northwrit_User-Journeys.md), [user stories](04-specs/Northwrit_User-Stories.md), [workflow contracts](04-specs/Northwrit_Workflow-Contracts.md) |
| Product design | [Approved feature navigation](05-design/NorthWrit-Feature-Navigation.md), [UI specification](05-design/Northwrit_UI-Spec.md), [wireframes](05-design/Northwrit_Wireframes.md); use the [engineering design system](engineering/design-system.md) for existing UI primitives |
| Pilot and commercial proposals | [GTM strategy](03-market/Northwrit_Marketing-and-GTM-Strategy.md), [pilot charter](08-gtm/Northwrit_Pilot-Charter.md), [CPD/MSP proposal](08-gtm/Northwrit_LSO-CPD-Accreditation.md) |

## Technical references

| Authority | Documents |
|---|---|
| Current implementation | [Working stack and surfaces](06-technical/NorthWrit-Current-Implementation.md), [repository ownership](06-technical/NorthWrit-Repository-Ownership.md), [backend architecture](engineering/backend-architecture.md) |
| Target product architecture | [System architecture](06-technical/Northwrit_System-Architecture.md), [hybrid AI and Shield](06-technical/Northwrit_Hybrid-AI-Architecture.md), [data model](06-technical/Northwrit_Data-Model.md), [API design](06-technical/Northwrit_API-Design.md) |
| Target security and deployment | [Security requirements](06-technical/Northwrit_Security-Compliance.md), [deployment architecture](06-technical/Northwrit_Deployment-Architecture.md) |
| Target platform designs | [Layers and surfaces](06-technical/Northwrit_Platform-Layers-and-Surfaces.md), [agent platform](06-technical/Northwrit_Agent-Builder-Platform-Architecture.md), [multi-surface design](06-technical/Northwrit_Glassy-Multi-Surface-Platform-Architecture.md) |
| Earlier proposals | [Polyglot stack proposal](06-technical/Northwrit_Architecture-Stack.md), [superseded v3 repository blueprint](06-technical/Northwrit_Repo-Structure.md) |

## Delivery and verification

- [Implementation plan](07-implementation/NorthWrit-Implementation-Plan.md): current phase status and acceptance gates.
- [Source audit](07-implementation/NorthWrit-Source-Audit.md) and [feature disposition](07-implementation/NorthWrit-Feature-Disposition.md): pinned-source findings and reuse/adapt/build/defer decisions.
- [Phase 4 extension map](07-implementation/NorthWrit-Phase-4-Extension-Map.md): existing owners and verification needed for the next phase.
- [CI inventory](07-implementation/NorthWrit-CI-Inventory.md): seven active checks and integration/release gaps.
- [Documentation coverage](07-implementation/NorthWrit-Documentation-Coverage.md): application/test references and all 41 engineering documents.
- [Repository](07-implementation/NorthWrit-Repository-Verification.md), [migration](07-implementation/NorthWrit-Migration-Verification.md), [workspace](07-implementation/NorthWrit-Workspace-Verification.md) and [configuration](07-implementation/NorthWrit-Configuration-Verification.md) verification: evidence at each milestone.
- [Migration path map](07-implementation/NorthWrit-Migration-Paths.json): old-to-new source and supporting-file destinations.
- [Cloud runbook](07-implementation/NorthWrit-Cloud-Runbook.md): earlier cloud startup investigation; use current setup guides for today's paths and commands.

## Guides

- [Supplier-review demo](guides/demo.md): verified document/workflow setup journey, six actual screenshots and synthetic sample PDFs.

- [Developer guide](guides/developer.md): current setup and verification entry point.
- [Engineering and operations](engineering/README.md): local infrastructure, integrations, testing and operating procedures.
- [User guide](guides/user-guide.md): current tasks, workspace choices, model/tool setup and client limitations.
- [Administrator guide](guides/administrator.md): configuration, roles, connections, operations and offboarding.
- [Security and privacy overview](guides/security.md): current controls, target requirements and evidence still needed.

## Architecture decisions

- [ADR 0001](decisions/0001-repository-structure.md): initial organization, retained as decision history.
- [ADR 0002](decisions/0002-expanded-repository-structure.md): accepted expanded layout.
- [ADR 0004](decisions/0004-retire-source-reference-archive.md): retired reference archive, current provenance and root policies.
- [ADR 0003](decisions/0003-npm-root-workspace.md): nine private npm workspaces and the authoritative root lockfile.

Preserve the [license](../LICENSE), [notice](../NOTICE.md), [credits](../Credit.md) and [source provenance](06-technical/NorthWrit-Source-Provenance.md). Historical and compatibility identifiers are explained in the configuration record.

Navigation: [NorthWrit navigation milestone](07-implementation/NorthWrit-Navigation-Milestone.md) — the pre-Phase 4 UI scope and verification.
