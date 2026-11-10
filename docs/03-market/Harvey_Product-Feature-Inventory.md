# Harvey product feature inventory

Research snapshot: November 9, 2026. This inventory covers the product surfaces and subfeatures identifiable in Harvey’s public product pages, Help Center indexes, release notes, and developer documentation. Product pages establish advertised scope. Release notes and launch announcements establish availability where stated. Workspace settings, licensing, region, and staged rollouts can affect access. Some Help Center articles require sign-in, so this inventory cannot establish every tenant-specific control or workflow.

## 1. Assistant and Threads

| Feature | Subfeatures |
|---|---|
| Legal assistant | Ask questions, analyze and summarize documents, compare materials, draft and revise content, and ask follow-up questions in a thread. |
| Source selection | Upload or select files, attach Vaults and Review Tables, use legal knowledge sources and web search, add enabled connectors, and mention specific sources in the composer. |
| Evidence | Inline citations and a source panel for inspecting linked source material. Source filters and scope depend on the selected research source. |
| Complex work | Plan Mode, task breakdown, clarification at decision points, context panel, progress tracking, and multiple tasks in flight. |
| Prompt assistance | Magic Prompt, suggested prompts, nudges to attach relevant sources or use a Review Table or agent, and voice dictation. |
| Notepad and drafting | Inline editable drafts, multiple drafts in one thread, a dedicated email drafting experience, conversion to Word, and saving drafts to Vault. |
| File production | Create or edit Word, Excel, PowerPoint, and PDF files. Edit multiple Word documents and preserve document structure and formatting where supported. |
| Visual outputs | Interactive charts, timelines, and other visuals generated from source material. |
| File processing | Document upload, password-protected files, PST email and attachment extraction, and audio transcription. |
| Translation | Translate uploaded files or pasted text from a thread using DeepL, with formatting preserved for supported files. |
| Share and export | Share threads with workspace colleagues, manage view access, export using firm-approved Word formats, save outputs to Vault, and create Outlook drafts. |
| Navigation and reuse | Global search, Recents, History, saved queries, and Library entry points. |

Sources: [Assistant Help Center](https://help.harvey.ai/topics/assistant), [Assistant release notes](https://help.harvey.ai/release-notes/category/assistant), [Getting Started](https://help.harvey.ai/articles/getting-started-with-harvey).

## 2. Harvey II, agents, memory, and workflows

| Feature | Subfeatures |
|---|---|
| Harvey II context | Agents use context from matters and projects. A thread can be scoped to a Space and client matter, including the Space linked to a selected matter. |
| Agent routing | Suggest relevant Vaults, tables, research sources, connectors, or specialist agents. Route tasks and deliver several outputs from a single request. |
| Built-in agents | Harvey provides practice-oriented agents for legal research, review, drafting, and other recurring legal tasks. |
| Custom Agent Builder | Encode instructions and firm standards, attach files and sources, reference Review Tables, and update agent details and descriptions. |
| Agent execution | Discover and run custom agents, schedule recurring runs, receive clarification questions during execution, and use supported custom agents from Word. |
| Agent governance | Assign agent permissions, manage workspace agents, and review requests to share them. |
| Workflow Builder | Build guided, repeatable processes with structured inputs and embedded Vault or legal sources. Include Review Table steps and share approved workflows. |
| Prebuilt workflows | Redline analysis and issue lists, document translation, and preconfigured Vault extraction tables. Licensed partner workflows can have separate access requirements. |
| Personal memory | Store and manage drafting preferences, negotiation posture, jurisdiction, and other standing instructions. Import preferences from another AI platform. |
| Writing and locale | Apply custom writing styles, firm export formats, preferred language, and jurisdiction-aware output preferences. |
| Model layer | Model selection in supported surfaces and regions. Harvey II also introduces Harvey intelligence trained for legal work. |

Harvey II is documented as a phased rollout. Agents and guided workflows remain distinct, even where both automate the same legal task.

Sources: [Harvey II announcement](https://www.harvey.ai/blog/introducing-harvey-ii), [Agents & Workflows](https://help.harvey.ai/topics/workflows), [Custom agents in Word](https://www.harvey.ai/blog/run-custom-harvey-agents-in-microsoft-word), [Release notes](https://help.harvey.ai/release-notes).

## 3. Vault and institutional knowledge

- **Repositories.** Create private or shared Vaults for files, email, and saved work. Harvey advertises capacity for up to 100,000 documents per Vault. Use Vault material across web, Workflows, mobile, and the Microsoft add-ins.
- **Ingestion.** Upload files and folders, import from supported document systems, extract email and attachments from PST files, unlock protected files, and transcribe audio.
- **Organization.** Browse folders, sort files, and direct Harvey in plain language to create folders, move or rename files, and surface possible duplicates.
- **Analysis.** Query selected documents or attach a full Vault for agentic search. Run bulk summaries, cited analyses, and predefined extraction workflows.
- **Collaboration.** Share with granular view and edit rights, transfer ownership, restrict downloads or duplication, and explicitly add private threads to a Vault.
- **Knowledge Bases.** Convert Vaults into managed collections of precedents, templates, and other firm material for reuse in analysis and drafting.
- **Lifecycle.** Configure retention by workspace, Vault, or client matter, recover deleted Vaults within the documented recovery window, export a file and metadata log, and receive configured lifecycle notifications.

Sources: [Vault product page](https://www.harvey.ai/platform/vault), [Vault release notes](https://help.harvey.ai/release-notes/category/vault), [Admin Guides](https://help.harvey.ai/topics/admin-guides).

## 4. Review Tables

- **Create and reuse.** Start from uploads, a Vault, a thread, a template, or rows selected from an existing Vault table. A dedicated home page supports finding, filtering, and starring tables.
- **Configure extraction.** Generate columns from natural language or create them manually. Set persistent table instructions, add manual input columns, attach reference files to columns, and use results from earlier columns as inputs to later columns.
- **Work across documents.** Analyze files individually or group related files into one row. Convert folders to groups, import metadata, and compare extracted terms or facts across the table.
- **Inspect and correct.** Review cell-level reasoning and sentence citations, open source previews, edit cells inline, rerun individual cells, and lock answers against changes.
- **Coordinate review.** Assign rows, flag cells by colour, comment on cells, share and move tables, and receive generation or sharing notifications.
- **Use the table downstream.** Ask questions over extracted results, add additional source context, reference a table in an agent, and build summaries, memos, or charts from the extracted data.
- **Automate table changes.** Ask Harvey to perform bulk edits and table management actions. Link a table to a Vault or selected folders and sync newly arrived documents as rows, running existing columns on those rows.
- **Roadmap.** A single Review Table drawing files from several Vaults and Knowledge Bases was described as an upcoming capability. A mixed-source static table is a separate output.

Sources: [Review Tables release notes](https://help.harvey.ai/release-notes/category/review-tables), [Review Table agent actions](https://www.harvey.ai/blog/review-table-agent-actions), [Review Table Sync](https://www.harvey.ai/blog/review-table-sync), [Multi-source roadmap entry](https://help-harvey.vercel.app/roadmap/multi-source-review-tables).

## 5. Knowledge and legal research

- **Regional legal sources.** Select curated jurisdictional collections for case law, statutes, regulations, or related public material. Harvey documents source restrictions, citations to underlying material, and general availability or early access by collection.
- **Web and specialist research.** Search the web, narrow research with source filters, use securities filings and regulatory collections such as EDGAR and EUR-Lex, and research U.S. patents for prior art, invalidity, or competitive analysis.
- **Licensed content.** Publicly named examples include Ask LexisNexis, FromCounsel, SCC Online, Tirant lo Blanch, Wolters Kluwer, Otto Schmidt, Lovdata, and Gyldendal Rettsdata. Coverage and entitlements vary.
- **Authority treatment.** Ask LexisNexis is a separately licensed U.S. source with Shepard’s indicators. Treat citation display and citator treatment as separate capabilities in a comparison.
- **Canada.** The reviewed public sources did not establish a Canadian source-by-source coverage matrix, a CanLII integration, or a Canadian citator entitlement. Those details remain unverified.

Sources: [Knowledge Sources Help Center](https://help.harvey.ai/topics/knowledge-sources), [Harvey FAQ](https://help.harvey.ai/articles/harvey-faq), [October product releases](https://www.harvey.ai/blog/the-brief-october-2026).

## 6. Spaces and client matters

- **Shared workspaces.** Work across firm teams, clients, outside counsel, and co-counsel with scoped guest accounts and access to approved resources.
- **Matter structure.** Associate Spaces with client matters, create phases and tasks, and reuse Space templates containing phases, tasks, agents, and resources.
- **Shared context and deliverables.** Share Vaults, artifacts, workflows, agents, and playbooks. Query a Space directly from a thread.
- **Governance.** Use resource-level permissions, organization approval controls, ethical walls, and audit trails for access grants, shares, queries, and approvals.
- **Operations.** Monitor activity through Space analytics and follow tasks, comments, and shared-resource events through the Notifications hub.

Sources: [Spaces](https://www.harvey.ai/platform/spaces), [Release notes](https://help.harvey.ai/release-notes), [Admin Guides](https://help.harvey.ai/topics/admin-guides).

## 7. Playbooks and Contract Intelligence

| Feature | Subfeatures |
|---|---|
| Playbook Builder | Capture positions, fallbacks, and escalation rules from firm standards and precedents. Edit and organize rules, and request suggested positions. |
| Playbook review | Run from Word or web. Review against covered rules, classify deviations, flag provisions outside scope, add contextual files and instructions, and get proposed edits. |
| Negotiated drafts | Use redline-only review for later rounds. Review tracked changes and generate editable redlined Word documents. |
| Contract intake | Bring documents in from connected Vaults, forwarded email, Jira, ServiceNow, and supported business systems. |
| Contract agents | Identify agreement type, gather deal context, choose standards, perform first-pass review, and prepare results for a reviewer. |
| Review operations | Central queues, assignment rules, statuses, and ownership tracking. |
| Precedent benchmarking | Compare negotiation positions to executed agreements at the clause level and surface evidence for updates to playbooks or review agents. |
| Portfolio intelligence | Analyze risk exposure and trends across contract terms, surface obligations, renewals and notice periods, and report on volume and turnaround. |

The Contract Intelligence product page describes advertised scope. The reviewed sources do not establish universal access to every module.

Sources: [Contract Intelligence](https://www.harvey.ai/platform/contract-intelligence), [Playbook Builder](https://www.harvey.ai/blog/playbook-builder-in-harvey), [Running a playbook](https://www.harvey.ai/blog/contract-playbook), [Playbook release notes](https://help.harvey.ai/release-notes/page/3).

## 8. Horizon Scanning

- Create a scan in plain language, let Harvey suggest sources and topics, and monitor regulatory and legislative developments across supported jurisdictions.
- Triage by relevance, topic, industry, source, and jurisdiction. Search, star, or archive developments and inspect cited summaries, effective dates, and relevance explanations.
- Subscribe to email alerts and weekly digests, and share scans with colleagues.
- Use scan context to build timelines, summarize changes, revise memos, draft notices, and save material to Vault.

Sources: [Horizon Scanning](https://www.harvey.ai/platform/horizon-scanning), [Launch announcement](https://www.harvey.ai/blog/horizon-scanning-in-harvey).

## 9. Intake and Facts & Chronologies

| Product | Availability and subfeatures |
|---|---|
| Intake | Early access for in-house teams. Capture requests in existing channels and a guest experience, route by configured rules, run agents before human review, assign team queues, send status updates, hand contracts to Contract Intelligence, and preserve an audit trail. Harvey also announced an Intake experience in Claude. |
| Facts & Chronologies | Early access with design partners. Extract and connect facts and entities from evidence, preserve citations and factual context, and generate chronologies, witness outlines, memos, or reports. Maintain a shared fact record as a matter develops and flag prior work that may need updating. |

Sources: [Intake](https://www.harvey.ai/platform/intake), [Intake in Claude](https://www.harvey.ai/blog/harvey-intake-claude-for-legal-artifact), [Fact Graph](https://www.harvey.ai/blog/fact-graph-for-litigation-disputes-internal-investigations), [FORUM Chicago availability announcements](https://www.harvey.ai/blog/forum-chicago-product-announcements).

## 10. Microsoft, email, and mobile

| Surface | Subfeatures |
|---|---|
| Word add-in | Draft and edit from prompts and precedents, use Vault and document management sources, apply redlines and playbooks, translate, fill templates, run supported custom agents, dictate prompts, and access unified web and Word history. |
| Outlook add-in | Analyze messages, threads, and attachments, carry context across emails, draft replies and documents, and route email to Vault. Drafts can also be created in Outlook from supported Harvey web, Word, and agent experiences. |
| Email Harvey | Send a question from email and receive the answer in the same conversation. |
| Microsoft Teams | Search enabled Teams chats, channels, and shared files from Harvey. |
| Microsoft 365 Copilot | Access Harvey in Copilot and supported Cowork experiences. |
| iOS and Android | Access synced Vault and History, run queries and supported agents, use mobile connectors, scan documents, dictate prompts, and record or transcribe audio. Recent transcript updates add search, editable text, speaker labels, and playback. |

Sources: [Ecosystem](https://www.harvey.ai/platform/ecosystem), [Integrations](https://help.harvey.ai/topics/integrations), [Harvey Mobile](https://www.harvey.ai/platform/harvey-mobile), [Release notes](https://help.harvey.ai/release-notes).

## 11. Connectors, API, and MCP

| Area | Subfeatures |
|---|---|
| Document management and storage | iManage, NetDocuments, SharePoint/OneDrive, Google Drive, and Box. Import, export, search, folder sync, and browser extension support vary by integration. |
| Specialized connectors | PacerPro federal docket sync into Vault, Ansarada data-room imports and sync, Ironclad signed-agreement imports, Octus credit intelligence, Gmail search, and Aderant iTimekeep draft billing narratives. |
| Ethical wall providers | Intapp Walls for AI and iManage SPM sync. Document-level matter association for iManage files and client or matter name sync where supported. |
| Connector Library | Native integrations and partner MCP connectors with workspace enablement and user sign-in where applicable. |
| Inbound MCP | Connect a firm-managed MCP server, choose who can use it, and scope available tools. Action support and controls vary by connector. |
| Hosted Harvey MCP | Expose supported Harvey research and Vault tools to external AI assistants. Discover accessible Vault projects and knowledge sources, then query them. |
| REST API | Developer portal, workspace-admin-issued bearer tokens, and HTTPS authentication. |
| Announced integration | Broader two-way iManage sync was announced for early access. Existing iManage search, import, and export are separately documented. |

Sources: [Integrations](https://help.harvey.ai/topics/integrations), [Connector Library architecture](https://www.harvey.ai/blog/how-we-built-harvey-connector-library), [MCP configuration](https://help.harvey.ai/articles/joining-harvey-mcp-connector-library), [Developer API](https://developers.harvey.ai/api-reference/authentication), [FORUM Chicago](https://www.harvey.ai/blog/forum-chicago-product-announcements).

## 12. Library, History, Command Center, and security

| Feature | Subfeatures |
|---|---|
| Library | Browse prompts, examples, agents, workflows, playbooks, and Review Table templates. Create and curate shared resources and bulk import prompts by CSV. |
| History | Retrieve prior queries, responses, and files, filter by criteria such as date or matter, and revisit saved work. |
| Adoption analytics | Track usage by person, feature, role, region, and practice group. Compare usage with peers and export analytics. |
| Command Center Agent | Query usage data, revisit prior questions, produce reports or presentations, and surface recommended actions or features. |
| Identity and access | SAML SSO, SCIM user and group provisioning, profile sync, guest provisioning, workspace roles, custom permissions, and IP allow-listing. |
| Workspace configuration | Branding, notices, export formats, notification options, and controls for integrations, models, knowledge sources, content sharing, and guest access. |
| Matter controls | Bulk manage client matters, enforce synced ethical walls, and configure access at the workspace, matter, and resource levels. |
| Audit and retention | Search, filter, and export audit logs and workspace history. Set retention by workspace, Vault, or client matter and preview deletion impact. |
| Security and data governance | Encryption, logical tenant separation, contractual restrictions on model training, and regional hosting options advertised for the U.S., EU/Switzerland, and Australia. |

Sources: [Getting Started](https://help.harvey.ai/articles/getting-started-with-harvey), [Admin Guides](https://help.harvey.ai/topics/admin-guides), [Command Center](https://www.harvey.ai/platform/command-center), [Security](https://www.harvey.ai/security), [Release notes](https://help.harvey.ai/release-notes).
