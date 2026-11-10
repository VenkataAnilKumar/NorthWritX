# Northwrit open-source references

Updated November 9, 2026. This register records the upstream references reviewed during platform selection.

## Selected foundation

**Onyx Standard Community Edition** is the selected starting point for evaluating a NorthWritX fork. The selection assumes retaining the option to commercialize proprietary NorthWritX additions.

- Clone source: https://github.com/onyx-dot-app/onyx-foss
- License: https://github.com/onyx-dot-app/onyx-foss/blob/main/LICENSE
- Main development reference: https://github.com/onyx-dot-app/onyx
- Repository choice: Onyx describes onyx-foss as its MIT-only repository, automatically synchronized from the main repository. Use this as NorthWritX's fork source to avoid including separately licensed enterprise code. The main repository remains useful for release and development context.
- Documentation: https://docs.onyx.app/
- Reuse targets: agent workspace, chat, document ingestion, indexed retrieval, connectors, custom agents, deep research, model integrations, and artifacts.
- License boundary: onyx-foss has an MIT license. The main onyx repository mixes MIT community code with separately licensed `ee` directories. Third-party components retain their own licenses. Preserve required notices and check the exact files included in a commercial build. Enterprise features described in the shared README must be verified against the FOSS implementation before treating them as included.
- Deployment choice: Standard includes indexing and connector workers. Lite omits document indexing.
- NorthWritX work: matter authorization, Canadian research sources, Bearings, four-state CiteCheck, version-bound Folio approvals, Shield egress enforcement, Review Grid, playbooks, and Office integration.

Selection is based on documentation and repository inspection. A fork, pinned revision, running deployment, security assessment, and implementation audit remain outstanding.

## Other evaluated platforms

| Project | Upstream | Role for NorthWritX | Licensing and scope notes |
|---|---|---|---|
| MikeOSS | https://github.com/Open-Legal-Products/mike | Closest legal-product reference for matter/document chat, drafting, tabular review, reusable workflows, and Word add-in | AGPL-3.0. Modified network-served deployments carry source-offer obligations. Review compatibility before incorporating code into a proprietary product. |
| OpenContracts | https://github.com/Open-Source-Legal/OpenContracts | Evidence viewer, precise annotations, citation relationships, extraction tables, document agents, and MCP reference | Review the license and dependencies at the chosen revision before extraction. Functional similarity does not establish NorthWritX approval or isolation guarantees. |
| Kortix / CompanyOS | https://github.com/kortix-ai/CompanyOS | Shared agents, skills, memory, triggers, model gateway, and approval patterns | The former Suna URL redirects here. Review current repository and commercial/white-label terms separately. Self-hosting alone does not establish disconnected operation. |

Mike license: https://github.com/Open-Legal-Products/mike/blob/main/LICENSE

Kortix self-hosting: https://kortix.com/self-hosted

## Univer Office SDK

- [Product overview](https://univer.ai/) · [Source repository](https://github.com/dream-num/univer) · [Sheets documentation](https://docs.univer.ai/guides/sheets)
- **Primary fit:** Evaluate Univer Sheets as the editable layer for Review Grid (RV03). Its Apache-2.0 core provides spreadsheet editing, formulas, sorting, filtering, validation, and comments.
- **Other uses:** Evaluate Docs for Folios, PDF tools for evidence viewing, and headless calculation for legal calculators.
- **Edition boundary:** Univer's built-in XLSX conversion, real-time collaboration, and shared history use commercial extensions. XLSX snapshot conversion still requires a conversion backend. [Open-source and Pro breakdown](https://github.com/dream-num/univer#-open-source-and-pro) · [File exchange](https://docs.univer.ai/guides/sheets/features/import-export)
- **NorthWritX responsibilities:** Enforce matter access, preserve cell-to-passage links and source versions, and manage stale evidence, approvals, and exports.
- **Evaluation:** Prototype a cited grid with a few contracts. Verify that clicking a cell opens its exact source passage and replacing that source marks the affected cell stale. Status is documentation review. Integration remains untested.

## iPolloWork

- [Product overview](https://ipollo.ai/) · [Source repository](https://github.com/Devin-AXIS/iPolloWork) · [Feature index](https://ipollo.ai/docs/en/guides/work-capabilities/)
- **Primary fit:** Use as a design reference for the NorthWrit desktop companion and matter dashboard. iPolloWork keeps task instructions, files, agent activity, and editable results in one persistent session. [Workspace and agents](https://ipollo.ai/docs/en/use/workspace-and-agents/)
- **NorthWritX workflows:** Apply this pattern to research-to-memo runs, Run Trail inspection, retries, and Folio editing beside evidence. Its separation of templates, Skills, plugins, and MCP tools also informs Firm Packs.
- **Product architecture:** Work is the client workspace, Enterprise Server manages team membership and resources, and iPolloOS manages models and inference. [Product guide](https://ipollo.ai/docs/en/guides/product-guide/)
- **Source terms:** iPolloWork is source-available. Commercial and white-label use require prior written authorization under its published terms. [License](https://github.com/Devin-AXIS/iPolloWork/blob/main/LICENSE)
- **Evaluation status:** Public documentation and repository reviewed. NorthWritX integration remains untested.

## Existing component references

These references are carried forward from the [reuse blueprint](../06-technical/Northwrit_Open-Source-Components.md). Their current licenses, APIs, and suitability require verification at the selected revision.

| Project | Repository | Intended reference area |
|---|---|---|
| Sim | https://github.com/simstudioai/sim | Visual workflow builder |
| Agno | https://github.com/agno-agi/agno | Agent execution and evaluation |
| Jan | https://github.com/janhq/jan | Local inference and desktop experience |
| LobeHub | https://github.com/lobehub/lobe-chat | Workspace interaction design; check community/commercial license boundaries before code reuse |
| Perplexica | https://github.com/itzcrazykns/perplexica | Cited web research experience |
| Docling | https://github.com/docling-project/docling | Layout-aware document ingestion |
| Eyecite | https://github.com/freelawproject/eyecite | Citation parsing; Canadian coverage requires explicit validation |
| Presidio | https://github.com/microsoft/presidio | Entity detection and redaction |
| Tiptap | https://github.com/ueberdosis/tiptap | Structured Folio editor |
| LangGraph | https://github.com/langchain-ai/langgraph | Durable workflows and approval checkpoints |

## Adoption record required for each dependency

Record the chosen commit or release, included paths, applicable licenses and notices, local changes, upstream update strategy, and validation results. Any claim that a component supplies matter isolation, Canadian processing, citation validity, or zero egress requires a NorthWritX-specific test.
