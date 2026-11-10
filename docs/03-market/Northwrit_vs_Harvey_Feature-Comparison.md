# Northwrit vs. Harvey AI

Comparison date: November 9, 2026. The Northwrit side uses the **proposed** v2.0 [Feature Specification](../04-specs/Northwrit_Feature-Spec.md) and [Product Definition](../02-product/Northwrit_Product-Definition.md). The Harvey side uses public product documentation, release notes, and the [Harvey feature inventory](Harvey_Product-Feature-Inventory.md). This is a comparison of documented scope. Northwrit priorities do not establish shipped capabilities, and Harvey access can vary by workspace, region, licensing, or rollout.

## Product positioning

| Dimension | Northwrit | Harvey |
|---|---|---|
| Audience | Canadian firms and in-house teams, with Ontario as the proposed launch market | Law firms and in-house teams across jurisdictions |
| Core workflow | A cited, editable research memo grounded in matter records and public authority, with approval tied to a version | A broader suite of legal research, drafting, document review, agents, and matter coordination |
| Data model and collaboration | Matter as the primary access and processing boundary | Client Matters, Vaults, and Spaces with resource sharing and synced ethical walls |
| Research assurance | Bearings and four-state CiteCheck; authority treatment depends on licensed sources | Regional and specialist research with citations; separate U.S. LexisNexis entitlement for Shepard’s indicators |
| Deployment | Proposed Canadian-region cloud, then Local Companion and offline desktop | Cloud service with published regional hosting options and native Office and mobile surfaces |
| Expansion | Review Grid, contract playbooks, agents, connectors, and Packs | Contract Intelligence, Horizon Scanning, project orchestration, Intake, Facts & Chronologies, and a broader connector ecosystem |

Sources: [Harvey Platform](https://www.harvey.ai/platform), [Harvey FAQ](https://help.harvey.ai/articles/harvey-faq), [Harvey Security](https://www.harvey.ai/security).

## Coverage across all 105 Northwrit requirements

**M** = material functional match. **P** = partial match with a material difference or an unverified requirement. **E** = closest public counterpart is in early access. **U** = no counterpart verified in the public sources reviewed. A match indicates comparable function, with implementation and availability varying. An unverified feature may exist in a private tenant or commercial arrangement.

| Northwrit phase | M | P | E | U | Total |
|---|---:|---:|---:|---:|---:|
| P0 | 10 | 28 | 0 | 0 | 38 |
| P1 | 23 | 11 | 2 | 3 | 39 |
| P2 | 9 | 13 | 1 | 5 | 28 |
| **Total** | **42** | **52** | **3** | **8** | **105** |

## Harvey capabilities with additional depth

This reverse view covers each surface in the Harvey inventory. The IDs identify the nearest Northwrit requirements. The differences column captures the additional Harvey subfeatures or packaging with no explicit match in the Northwrit baseline.

| Harvey surface | Closest Northwrit scope | Additional depth or scope difference |
|---|---|---|
| Assistant and Threads | AS01–AS07, RS01–RS07, SO02, SO05–SO06, SO10 | Multi-task thread view and source nudges, several drafts in a thread, email draft mode, in-thread Office and PDF editing, batch Word edits, and direct Outlook draft creation. |
| Harvey II, agents, and memory | MT02–MT04, AG01–AG06, AG09–AG14, CU03 | Agent selection across source types and connectors, personal memory import, matter and Space context, and legal-specific model training. |
| Vault and Knowledge Bases | MT01, RV01–RV06, SO01, SA05 | Advertised 100,000-document Vault capacity, broad file ingestion including protected files and audio, Vault conversion, plain-language folder changes, recovery, metadata logs, and DMS sync. Harvey’s Nov 9 release adds GIF and DICOM support and raises selected upload limits. |
| Review Tables | RV03, RV07, SO06, AG04 | Table-level instructions, reference files, conditional columns, row assignment, flags, cell comments and locks, granular reruns, direct agent edits, and incremental Vault sync. Multi-source tables were separately listed on the roadmap. |
| Knowledge and legal research | RS01–RS05, RS07, RS10 | Broad regional, regulatory, tax, securities, patent, and licensed publisher sources. Canadian source coverage and Canadian citator access remain unverified. |
| Spaces and matters | MT01, MT05–MT07, SO03, SA11 | Cross-organization resource approvals, shared Vaults and artifacts, guest workflows, Space analytics, and reusable phases and tasks. |
| Playbooks and Contract Intelligence | DR01–DR05, RV06–RV07, AG07–AG08 | Automated intake from connected systems, contract classification, review assignments, benchmarking against executed clauses, recommendations to update playbooks, portfolio risk and turnaround reporting. |
| Horizon Scanning | RS08, RS11, AG06–AG07 | Plain-language scan setup, multi-jurisdiction regulatory coverage, relevance triage, digests, shared scans, and downstream agent actions. |
| Intake | AG08, AG12–AG13 | Early access. Channel-based intake, guest request experience, automatic routing, agent first pass, team queues, status updates, audit trail, and handoff to Contract Intelligence. |
| Facts & Chronologies | MT04, SO09, AG04, AG11 | Early access. Connected factual and entity record, source evidence, chronology and witness outputs, and flags when prior work may need updating. |
| Microsoft, email, and mobile | DR05–DR07, AS07, CU05 | Unified Word/web history, custom Word agents, email-in queries, Teams search, Copilot access, mobile document scanning, speaker labels, transcript editing, and playback. |
| Connector Library, API, and MCP | CN01–CN07, SA11 | Native and MCP connector catalog, custom inbound MCP and hosted Harvey MCP, document-level walls, and specialized connectors such as PacerPro, Ansarada, Ironclad, Gmail, Octus, and iTimekeep. |
| Library, Command Center, and security | AS04, SO08, SA01–SA15, CU02–CU04 | Central resource and template library, bulk prompt import, peer benchmarks, agent-generated analytics deliverables, and a published audit and certification posture. |
| Legal Work Orchestration | MT05–MT07, SO03, AG05, AG08, AG14 | Matter project plans with phases, due dates, dependencies, human and agent assignees, reviewer handoffs, and work across firm and client teams. This product is publicly advertised; workspace availability was not verified. |

Sources: [Harvey feature inventory](Harvey_Product-Feature-Inventory.md), [Legal Work Orchestration](https://www.harvey.ai/platform/legal-work-orchestration), [Release notes](https://help.harvey.ai/release-notes), [FORUM Chicago announcements](https://www.harvey.ai/blog/forum-chicago-product-announcements).

## Northwrit features with distinct requirements

- **Canadian research and verification.** Bearings requires explicit checks for missing research scope. CiteCheck specifies four passage-support states, while licensed authority treatment remains a separate requirement. See RS02–RS06 and RS10.
- **Artifact review.** Northwrit specifies approval tied to a particular Folio version, invalidation when content or evidence changes, and an approved payload before an external write. See SO03–SO05 and AG03.
- **Processing boundaries.** Shield specifies stricter-of-firm-or-matter policy, policy-based egress checks, structured logs for every cloud send, and later local inference, reversible redaction, and offline sync. Northwrit also specifies Canadian processing. See SH01–SH08 and SA12.
- **Extensibility and diagnostics.** Northwrit specifies independent multi-model disagreement reporting, signed installable Packs, a Pack SDK, and a proposed public Pack Exchange. See RS09 and CN03–CN08.

## Northwrit feature-by-feature matrix

### Assist

| ID | Northwrit feature | Phase | Match | Closest Harvey capability and difference |
|---|---|---|---|---|
| AS01 | Pinpoint Cites | P0 | M | Cited passages and source inspection |
| AS02 | Model Picker | P0 | P | Model Selector; per-answer provider attribution contract unverified |
| AS03 | Save to Matter | P0 | M | Save outputs to Vault and add threads to Vault |
| AS04 | Prompt Library | P1 | M | Searchable Library with reusable prompts |
| AS05 | Specialists | P1 | M | Custom agents with instructions, files and sources |
| AS06 | My Style | P1 | M | Custom writing styles and personal memory |
| AS07 | Dictate | P2 | P | Voice prompts on web, mobile and Microsoft add-ins; standalone desktop coverage unverified |

Harvey sources: [Product or help documentation](https://help.harvey.ai/topics/assistant).

### Research

| ID | Northwrit feature | Phase | Match | Closest Harvey capability and difference |
|---|---|---|---|---|
| RS01 | Answer Engine | P0 | M | Cited legal and web answers with source inspection |
| RS02 | Bearings | P0 | P | Agent clarification and source nudges; mandatory pre-search field checks unverified |
| RS03 | Source Filters | P0 | P | Regional sources and custom filters; full court/date/coverage controls unverified |
| RS04 | Source Labels and Synthesis | P0 | P | Source selection and citations; prescribed claim labels and synthesis structure unverified |
| RS05 | CiteCheck | P0 | P | Passage citations and separately licensed Shepard’s indicators; four-state claim-support protocol unverified |
| RS06 | Research Memo | P0 | P | Editable cited drafts; fixed memo schema and table of authorities unverified |
| RS07 | Deep Research | P1 | M | Plan Mode with progress and decision points |
| RS08 | Beacon | P1 | P | Horizon Scanning plus PacerPro docket sync; matter-level decision-alert bundle unverified |
| RS09 | Triangulate | P2 | U | Independent multi-model comparison and disagreement reporting unverified |
| RS10 | Authority Treatment | P2 | P | Regional research and licensed U.S. Shepard’s; broader subsequent history coverage unverified |
| RS11 | Dispatch | P2 | P | Horizon Scanning digests; separate practice-area legal news feed unverified |

Harvey sources: [Product or help documentation](https://help.harvey.ai/topics/knowledge-sources), [Supporting documentation](https://help.harvey.ai/articles/harvey-faq).

### Review

| ID | Northwrit feature | Phase | Match | Closest Harvey capability and difference |
|---|---|---|---|---|
| RV01 | Smart Upload | P0 | M | Vault upload, indexing and ingestion feedback |
| RV02 | Document Versions | P0 | P | DMS sync and permission inheritance; full native document version semantics unverified |
| RV03 | Review Grid | P1 | M | Review Tables with cited cells and spreadsheet outputs |
| RV04 | OCR and Email Ingestion | P1 | P | Scanned document handling and PST extraction; prescribed failure handling unverified |
| RV05 | Auto-Sort | P1 | P | Agentic file organization and duplicate flags; exact automatic classification bundle unverified |
| RV06 | Precedent Bank | P1 | M | Knowledge Bases and precedent libraries |
| RV07 | Portfolio Compare | P2 | M | Contract Intelligence clause benchmarking and obligations |

Harvey sources: [Product or help documentation](https://www.harvey.ai/platform/vault), [Supporting documentation](https://help.harvey.ai/release-notes/category/review-tables).

### Draft

| ID | Northwrit feature | Phase | Match | Closest Harvey capability and difference |
|---|---|---|---|---|
| DR01 | Draft from Precedent | P1 | M | Precedent-based drafting and document templates |
| DR02 | Playbooks | P1 | M | Playbook Builder and firm negotiation positions |
| DR03 | Playbook Check and Redline | P1 | M | Web and Word playbook review with redlines |
| DR04 | Redline Report | P1 | M | Analyze a Redline workflow and issue lists |
| DR05 | Northwrit for Word | P1 | M | Word add-in for drafting, analysis and playbooks |
| DR06 | Northwrit for Outlook | P2 | M | Outlook add-in for summaries, replies and Vault filing |
| DR07 | Translate | P2 | M | DeepL document translation in threads, workflows and Word |

Harvey sources: [Product or help documentation](https://help.harvey.ai/topics/integrations), [Supporting documentation](https://www.harvey.ai/blog/contract-playbook).

### Matters

| ID | Northwrit feature | Phase | Match | Closest Harvey capability and difference |
|---|---|---|---|---|
| MT01 | Matter Workspace | P0 | M | Client Matters, Vaults and Spaces together cover core workspace functions |
| MT02 | Matter Instructions | P0 | P | Matter and project context and Memory; universal application of standing instructions unverified |
| MT03 | Privacy Setting | P0 | P | Matter scoping and policy controls; per-matter processing modes and persistent display unverified |
| MT04 | Fact Sheet | P1 | E | Fact Graph with connected evidence; early access |
| MT05 | Matter Templates | P1 | M | Space Templates preserve phases, tasks, agents and resources |
| MT06 | Matter Dashboard | P1 | P | Spaces phases, tasks and analytics; exact dates/runs/status dashboard unverified |
| MT07 | Client Rooms | P1 | M | Spaces with scoped guest access |
| MT08 | Legal Hold | P2 | P | Retention and recovery; dedicated legal-hold preservation semantics unverified |

Harvey sources: [Product or help documentation](https://www.harvey.ai/platform/spaces), [Supporting documentation](https://www.harvey.ai/blog/fact-graph-for-litigation-disputes-internal-investigations), [Additional documentation](https://www.harvey.ai/platform/legal-work-orchestration).

### Search and Outputs

| ID | Northwrit feature | Phase | Match | Closest Harvey capability and difference |
|---|---|---|---|---|
| SO01 | Northwrit Search | P0 | P | Global Search and permission-scoped retrieval; exact artifact coverage and search implementation unverified |
| SO02 | Folios | P0 | M | Editable drafts in Notepad plus Review Tables and document outputs |
| SO03 | Review States | P0 | P | Space approvals and audit events; version-bound review state machine unverified |
| SO04 | Folio History | P0 | P | Thread history and ongoing artifacts; compare/restore and reviewer-linked versions unverified |
| SO05 | Export (DOCX) | P0 | P | Word exports and firm formats; exact approval-version and scope export contract unverified |
| SO06 | Export (PDF, Excel, branding) | P1 | M | PDF and spreadsheet creation plus firm export formats |
| SO07 | Quick Jump | P1 | M | Global Search shortcut on Mac and Windows |
| SO08 | Conversation Search and Saved Searches | P1 | P | Searchable History and saved queries; saved-search rules unverified |
| SO09 | Timelines | P1 | M | Generate timelines in Assistant; connected Fact Graph is early access |
| SO10 | Charts and Decks | P2 | M | Interactive visuals and PowerPoint generation |
| SO11 | Calculators | P2 | P | General calculation and custom ROI examples; dedicated legal calculators unverified |
| SO12 | Client Brief | P2 | P | Shared Space artifacts and export; dedicated branded client brief surface unverified |

Harvey sources: [Product or help documentation](https://help.harvey.ai/topics/assistant), [Supporting documentation](https://help.harvey.ai/articles/getting-started-with-harvey).

### Agents and Automate

| ID | Northwrit feature | Phase | Match | Closest Harvey capability and difference |
|---|---|---|---|---|
| AG01 | Research-to-Memo Workflow | P0 | P | Guided workflows and planned execution; exact cancellation and retry persistence contract unverified |
| AG02 | Run Trail | P0 | P | Progress, history and audit logs; per-run tool/model/usage trace schema unverified |
| AG03 | Checkpoints | P0 | P | Decision checkpoints and connector policy; universal exact-payload approval unverified |
| AG04 | Agent Library | P1 | M | Prebuilt specialist agents and workflows; catalogue differs |
| AG05 | Agent Studio | P1 | P | Agent Builder and Workflow Builder; exact sample-test and publishing sequence unverified |
| AG06 | Schedules | P1 | M | Scheduled custom agents and recurring scans |
| AG07 | Deadline Watch and Digest | P1 | P | Contract key dates and scan digests; filing and Teams/Slack reminder bundle unverified |
| AG08 | Intake and Triage | P1 | E | Intake routes requests, assigns queues and runs agents; early access |
| AG09 | Agent Versions and Clone | P2 | P | Custom agents can be edited; draft/published rollback and cloning coverage unverified |
| AG10 | Relay and Critic | P2 | P | Agent routing and orchestration; dedicated critic chain behavior unverified |
| AG11 | Workbench | P2 | P | Agents can produce visuals and timelines; dedicated calculation workbench unverified |
| AG12 | Triggers | P2 | P | Intake and synced data sources support specific trigger patterns; general trigger coverage unverified |
| AG13 | Business Self-Service | P2 | E | Intake guest experience and contract handoff; early access |
| AG14 | Flow Builder | P2 | P | Workflow Builder and Legal Work Orchestration; precise branching/editor match unverified |

Harvey sources: [Product or help documentation](https://help.harvey.ai/topics/workflows), [Supporting documentation](https://www.harvey.ai/blog/forum-chicago-product-announcements), [Additional documentation](https://www.harvey.ai/platform/legal-work-orchestration).

### Connect and Packs

| ID | Northwrit feature | Phase | Match | Closest Harvey capability and difference |
|---|---|---|---|---|
| CN01 | Provider Adapters | P0 | P | Provider and source selection with policies; local runtime adapters unverified |
| CN02 | First Document Connector | P1 | M | Multiple DMS connectors including SharePoint and iManage |
| CN03 | Firm Packs | P1 | P | Shareable Library resources and Spaces; installable manifest-backed bundles unverified |
| CN04 | Connector Directory and Permission Sync | P2 | M | Connector Library and permission-aware iManage integration |
| CN05 | MCP and Enterprise APIs | P2 | M | Hosted and inbound MCP and REST API; trigger scope differs |
| CN06 | Pack Governance | P2 | P | Admin approval and connector security review; signed pack sandbox and rollback unverified |
| CN07 | Northwrit SDK | P2 | P | Developer API and MCP integration docs; Pack SDK, CLI and OpenAPI import unverified |
| CN08 | Pack Exchange | P2 | U | Public marketplace for installable legal packs unverified |

Harvey sources: [Product or help documentation](https://help.harvey.ai/topics/integrations), [Supporting documentation](https://developers.harvey.ai/api-reference/authentication), [Additional documentation](https://help.harvey.ai/articles/joining-harvey-mcp-connector-library).

### Shield

| ID | Northwrit feature | Phase | Match | Closest Harvey capability and difference |
|---|---|---|---|---|
| SH01 | Processing Policy | P0 | P | Workspace policy and regional hosting; Local Only/Hybrid/Cloud per matter unverified |
| SH02 | Model Gateway | P0 | P | Cloud Model Selector; unified local/cloud runtime gateway unverified |
| SH03 | Shield Log | P0 | P | Workspace audit logs; outbound policy-decision log with equivalent fields unverified |
| SH04 | Outbound Boundary | P0 | P | Connector and source policy controls; equivalent full egress enforcement scope unverified |
| SH05 | Local Companion | P1 | U | Local Companion and validated local inference unverified |
| SH06 | Smart Routing | P1 | P | Agent/source routing and regional controls; confidentiality-driven local routing unverified |
| SH07 | Redact and Restore | P1 | U | Reversible local redaction before cloud inference unverified |
| SH08 | Desktop and Offline Mode | P2 | U | On-device inference and offline sync unverified |

Harvey sources: [Product or help documentation](https://www.harvey.ai/security), [Supporting documentation](https://www.harvey.ai/blog/how-we-built-harvey-connector-library).

### Security and Admin

| ID | Northwrit feature | Phase | Match | Closest Harvey capability and difference |
|---|---|---|---|---|
| SA01 | Tenant Isolation and Authorization | P0 | P | Logical tenant separation and ethical walls; full end-to-end enforcement points unverified |
| SA02 | Encryption | P0 | P | TLS and AES-256; Canadian hosting option unverified |
| SA03 | Multi-Factor Sign-in | P0 | P | SAML and configured sign-in methods; universally enforced MFA unverified |
| SA04 | No Training | P0 | M | Contractual no-training policy for customer content by default |
| SA05 | Retention and Deletion | P0 | M | Workspace, Vault and client matter retention and deletion controls |
| SA06 | Rate Limits and Budgets | P0 | P | Usage analytics; task budget and abuse control equivalence unverified |
| SA07 | Users and Roles | P0 | M | Roles, custom permissions and guest accounts |
| SA08 | Model Policy | P0 | P | Model and source controls; local/cloud policy equivalence unverified |
| SA09 | Audit Trail | P0 | M | Searchable and exportable audit logs and workspace history |
| SA10 | Single Sign-On and SCIM | P1 | M | SAML SSO and SCIM; exact provider configuration differs |
| SA11 | Ethical Walls | P1 | M | Intapp and iManage SPM ethical walls with matter restrictions |
| SA12 | Canadian Residency | P1 | U | Public security materials list U.S., EU/Switzerland and Australia; Canadian processing unverified |
| SA13 | Seats, Billing and Feature Toggles | P1 | P | Access and feature administration; subscription and billing controls unverified |
| SA14 | Insights | P2 | M | Feature adoption and usage analytics with peer benchmarks; outcome metrics differ |
| SA15 | SOC 2 and ISO 27001 | P2 | M | Harvey reports SOC 2 Type II and ISO 27001; Northwrit specifies readiness |

Harvey sources: [Product or help documentation](https://help.harvey.ai/topics/admin-guides), [Supporting documentation](https://www.harvey.ai/platform/command-center), [Additional documentation](https://help.harvey.ai/articles/harvey-faq).

### Customization

| ID | Northwrit feature | Phase | Match | Closest Harvey capability and difference |
|---|---|---|---|---|
| CU01 | Preferences | P0 | P | Localization, jurisdiction preferences and Memory; complete McGill/Bluebook and bilingual UI coverage unverified |
| CU02 | House Style | P1 | M | Workspace branding, document templates, writing styles and export formats |
| CU03 | Memory Controls | P1 | P | User Memory and separate matter/Vault context; same controls across all scopes unverified |
| CU04 | Personal Library | P1 | M | Saved prompts, reusable agents and Library resources |
| CU05 | Northwrit Mobile | P2 | M | Native iOS and Android apps |
| CU06 | Clip to Matter | P2 | U | General-purpose web-page clipping to a matter unverified |
| CU07 | White-label | P2 | U | Partner-branded product with a custom domain unverified |

Harvey sources: [Product or help documentation](https://help.harvey.ai/topics/assistant), [Supporting documentation](https://www.harvey.ai/platform/harvey-mobile).

### Quality

| ID | Northwrit feature | Phase | Match | Closest Harvey capability and difference |
|---|---|---|---|---|
| QA01 | Northwrit Bench | P0 | P | Harvey publishes legal benchmarks; Northwrit’s exact CI gate and held-out task requirements unverified |

Harvey sources: [Product or help documentation](https://www.harvey.ai/blog/introducing-harveys-legal-agent-benchmark).
