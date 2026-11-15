# NorthWrit product catalogue

Reviewed November 14, 2026 against application baseline `7c08dba`. This catalogue describes capabilities present in the source and existing engineering guides. Availability depends on instance configuration, workspace, permissions and client. The review did not execute browser, provider or Office acceptance journeys.

Use the [user guide](../guides/user-guide.md) for everyday tasks, the [administrator guide](../guides/administrator.md) for setup and permissions, and the [capability matrix](../04-specs/NorthWrit-Capability-Matrix.md) for the remaining product requirements.

## Capability status

**Source-supported** means the current application contains the surface and supporting implementation; it does not mean every path has been validated in a running instance. **Configuration-dependent** means a provider, credential, service or client setup is also required. **Planned** means the requirement is not established by the current baseline.

| Capability | Current surface | Availability and boundary |
|---|---|---|
| Account and authentication | Sign-up, confirmation, sign-in, recovery, security settings | Source-supported; email, OAuth, SSO and MFA depend on configured services and policy |
| Personal and organization workspaces | Workspace switcher; organization settings | Source-supported; organization membership is distinct from item access |
| Projects and folders | Projects | Source-supported; the full legal Matter model is planned |
| Assistant and history | Assistant; History; project conversations | Configuration-dependent; requires an available model and authorized context |
| Library and templates | Library; files; template and preset screens | Source-supported; document processing requires storage and relevant workers |
| Document processing and search | Upload status, document viewers and search tools | Configuration-dependent; extraction is not a guarantee of complete OCR or semantic search |
| Tabular Reviews | Review list/detail and project review screens | Configuration-dependent; extraction and chat have separate execution/access rules |
| Drafting and editing | Document views, Assistant tools and Word | Configuration-dependent; lawyer review remains necessary |
| Playbooks | Playbooks | Configuration-dependent; imported guides and rule-based review require a model |
| Workflows and add-on packs | Workflows; assistant/tabular workflow editors; add-ons | Source-supported building blocks; governed agents and a public marketplace are separate requirements |
| Memory | Settings → Memory; project memory | Optional; scoped reference context, not permission or legal authority |
| Models and provider keys | Settings → Models / Bring Your Own Keys; organization providers | Configuration-dependent; organizational and personal credentials have different scopes |
| Research tools | Settings → Features / Connectors; Assistant | Optional web search and US case-law tools; Canadian legal research and four-state CiteCheck remain planned |
| Connectors and external actions | Settings → Connectors | Optional; connection/tool permissions and approval settings apply |
| Administration and audit | Organization settings; My Activity; privacy/data screens | Source-supported; comprehensive legal governance and certification remain separate requirements |
| Export | Document downloads and project export | Source-supported; hashes/signatures have specific limits, described below |
| Word | Word task pane | Configuration-dependent; currently Personal workspace only |
| Desktop | Electron client, including macOS local-mode configuration | Platform-dependent; packaging, signing and local-runtime acceptance require separate validation |

## Workspaces, projects and access

A user can work in Personal and organization workspaces. The selected workspace determines the relevant content and configuration. Organization membership does not grant unrestricted access to all private items. Item ownership, sharing and role checks apply to projects, chats, workflows, reviews and documents.

Projects group documents, folders, conversations and reviews. They are the existing foundation for the planned Matter workspace. Matter-specific metadata, unified navigation, ethical walls and complete two-user/two-matter acceptance remain Phase 4 work. Do not describe a Project as proof that all Matter requirements have been met.

Evidence: [project domain](../../apps/api/src/modules/projects/), [access helpers](../../apps/api/src/lib/access.ts), [project access](../../apps/api/src/lib/projectAccess.ts), [organization offboarding](../engineering/organization-offboarding.md).

## Assistant, history and research

Assistant supports streamed model answers, tools and saved conversations; project chat adds project context. A user must select an available model. Reconnecting to a supported server-owned run can replay frames, while an explicit Stop requests cancellation. A dropped connection is not automatically a cancellation or proof of a durable, resumable agent run after process failure.

Web search is optional and controlled under Settings → Features. It is available in Assistant and project chats, not Tabular Reviews or Word. Search choices depend on the model/provider and configured search service. CourtListener is a separately configured connector for US case-law search, fetching and citation tooling. Its presence does not establish Canadian source access or NorthWrit's planned four-state CiteCheck.

Evidence: [chat](../../apps/api/src/modules/chat/), [project chat](../../apps/api/src/modules/project-chat/), [server-owned runs](../engineering/backend-architecture.md#server-owned-runs), [web search](../engineering/web-search.md), [CourtListener](../engineering/courtlistener.md).

## Library, uploads and document evidence

Library organizes files and templates, including preset contract templates with their own publisher notices. Projects and workflows can also own document assets. Upload sessions coordinate signed staging uploads, completion/sealing and background processing. File transfer completion is distinct from successful processing or extracted text availability.

Document versions retain source paths, hashes and derived text. Search can use stored text with document access checks; extraction failures and incomplete OCR coverage must remain visible. Search over extracted text is not evidence that a separate vector index or a complete hybrid semantic-search product exists.

Evidence: [Library](../../apps/api/src/modules/library/), [upload domain](../../apps/api/src/modules/uploads/), [document domain](../../apps/api/src/modules/documents/), [text extraction/search](../engineering/document-text-search.md), [preset templates](../engineering/preset-templates.md).

## Review, drafting and playbooks

Tabular Reviews organize documents as rows and extraction questions as columns, with cited answers and review chat. Synchronous generation and asynchronous queue-based extraction have different run/cancellation behaviour. Cell output still needs source inspection; planned stale-evidence handling and version-bound legal approval require their own acceptance tests.

Playbooks can be authored manually or compiled from Word/PDF negotiation guides into structured rules, positions, examples and source references. Reviews use a snapshot of saved rules. Imported source references, rule compilation, replacement and background review have their own failure paths. Drafting and suggested changes are aids for lawyer review; they do not establish the proposed Folio approval lifecycle.

Evidence: [Tabular Reviews](../../apps/api/src/modules/tabular/), [playbooks](../engineering/playbooks.md), [document preview engines](../engineering/docx-preview-engines.md), [Word capabilities](../../apps/word-addin/README.md#what-it-supports).

## Workflows, tools and memory

Assistant and tabular workflows provide reusable instructions and configured assets. Add-on pack screens and catalogue tools exist. Document the supported package/install behaviour before describing a general plugin sandbox, public marketplace or enterprise agent studio as delivered.

Subagents are delegated tasks within a parent execution and follow the tool, approval and scope limits in the [subagent guide](../engineering/subagents.md). They do not establish every proposed agent scheduling, checkpoint, budget or recovery requirement.

Optional memory consists of private user/workspace Markdown and shared project memory. A separate curator can learn after a conversation becomes quiet. The live answer does not wait for that work. Memory is editable reference context, not a permission grant, instruction authority or citation source.

Evidence: [workflow domain](../../apps/api/src/modules/workflows/), [workflow catalogue source](../../apps/api/src/lib/workflowCatalogSource.ts), [memory](../engineering/memory.md), [memory domain](../../apps/api/src/modules/memory/).

## Models and integrations

The application provides provider adapters and model selection, including configured OpenAI-compatible endpoints and local Ollama options. Which models a user can select depends on available credentials and workspace policy. A model marked local does not by itself prevent other external calls or establish an offline/Local Only deployment.

Connectors are private to the connecting user and scoped to a workspace. Organization owners do not automatically inherit those connections. Google sign-in is separate from consent for Drive, Gmail or Calendar. MCP servers and native integrations have different setup and permission requirements.

Approval behaviour is connector-specific. MCP write approval is configurable; when required, Assistant/project chat can show the proposal, while Word and Tabular Reviews refuse writes needing that approval UI. Google Drive, Gmail and Calendar also use configurable write approval. With approval disabled, permitted writes execute directly; enable **Ask for permission for write actions** to review each proposal. Changing or revoking a connection can invalidate a pending action. Never describe every connector action as universally approved or universally blocked without checking its configuration.

Evidence: [configured models](../engineering/configured-models.md), [provider setup](../engineering/direct-provider-models.md), [connectors](../engineering/connectors.md), [Google Workspace](../engineering/google-workspace.md).

## Administration, lifecycle and export

Organization settings provide members, providers, privacy/data, private-content controls and audit surfaces. Offboarding distinguishes retained shared work, remaining ownership and private archives. Owner-only archive recovery is not general administrator access to private material; follow the documented role rules.

Project export manifests include document-version hashes and accept/reject history. A missing historical hash remains unverifiable. Optional Ed25519 signatures require explicit key configuration and protect manifest integrity; neither a matching hash nor a valid signature proves legal accuracy or reviewer approval.

Evidence: [organization domain](../../apps/api/src/modules/orgs/), [audit domain](../../apps/api/src/modules/audit/), [offboarding](../engineering/organization-offboarding.md), [export verification](../engineering/tamper-evident-exports.md).

## Word and desktop

Word provides document-aware chat, workflows, quick actions and tracked-edit review. Its conversations are separate from web Assistant history. Word currently uses Personal models, memory, workflows and document pickers; organization documents/workflow assets cannot be attached. HTTPS, Office sideloading and a reachable API require client-specific setup.

The Electron desktop shell wraps the web application and adds local window, link, download and connection controls. A macOS local-mode configuration also exists. Model inference, native dependencies, signed distribution and recovery require their own platform checks. Do not equate an unsigned development package or local model connection with an approved offline product.

Evidence: [Word guide](../../apps/word-addin/README.md), [desktop guide](../../apps/desktop/README.md), [current architecture](../06-technical/NorthWrit-Current-Implementation.md).

## Planned legal capabilities

The [implementation plan](../07-implementation/NorthWrit-Implementation-Plan.md) places the coherent legal workspace in Phase 4, Canadian research/CiteCheck/Shield and version-bound approvals in Phase 5, governed integrations in Phase 6, and pilot acceptance in Phase 7. The [feature specification](../04-specs/Northwrit_Feature-Spec.md) defines target behaviour; it is not this catalogue's current-availability list.
