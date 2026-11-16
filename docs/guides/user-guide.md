# NorthWrit user guide

Navigation updated November 16, 2026; capability baseline reviewed November 14, 2026 against `7c08dba`. This guide describes existing application surfaces. Available models, tools and content depend on your account, workspace and instance configuration. The [product catalogue](../02-product/NorthWrit-Product-Catalogue.md) explains capabilities and limitations; the [proposed journeys](../04-specs/Northwrit_User-Journeys.md) describe future legal workflows.

## Navigation

The main destinations are **Assistant**, **Matters**, **Library** and **Workflows**. Library groups Files, Templates and Playbooks; Workflows groups saved workflows and Reviews. Matters opens the existing project workspace with Documents, Conversations and Reviews. Stored project identifiers and `/projects` links remain unchanged; the fuller matter model is future work. Settings and Account are at the bottom, with Administration for owners/admins of the active organization. Open IDE through Settings → Advanced.

## Sign in and select a workspace

Open your instance's application URL and sign in. If registering by email, confirm the address before signing in. In the local development stack, confirmation messages appear in Mailpit. An administrator can provide the instance-specific setup and recovery instructions.

Select Personal or the relevant organization in the workspace switcher before choosing content, models or connectors. The selected workspace matters: a connection configured in Personal is not automatically available in an organization. Organization membership also does not grant access to every private project or item.

## Connect an available model

Use the onboarding model step or Settings → Bring Your Own Keys for a personal provider connection. Organization providers are managed through organization settings by authorized administrators. Choose a model offered for the workspace and task; use [provider guidance](../engineering/direct-provider-models.md) if a provider or saved selection is unavailable.

A local Ollama or OpenAI-compatible model requires instance configuration and a reachable endpoint. Selecting it does not disable every external connector or web request. Ask the administrator about actual data-handling requirements before using confidential documents.

## Organize work in Matters

Open Matters to create or select a matter, organize files/folders and use project conversations or reviews. Check the project access/sharing settings for the intended collaborators. A project can provide context for a conversation, but the complete proposed Matter workspace and its legal metadata are future work.

Keep separate evaluation projects for separate synthetic matters. If a project or file is unavailable, ask an authorized owner to check sharing rather than copying the material into a broader workspace.

## Add and inspect documents

Use Library for files/templates or the relevant project/workflow destination for its assets. Upload a supported file and watch its transfer and processing outcome. Successful transfer alone does not mean extraction is complete. Open the processed document to check the expected content before relying on answers about it.

If processing fails, keep the named error and document context for support. A scanned document may have incomplete text coverage; do not assume that every page was read. Templates and preset documents can have publisher-specific license terms. See [document text](../engineering/document-text-search.md) and [preset templates](../engineering/preset-templates.md).

## Ask Assistant and inspect sources

Open Assistant or a project's conversation, select an available model and attach/select authorized context. Ask a focused question and inspect linked source material in the response. Model output needs review even when it includes a citation.

Supported streams can reconnect while their server-owned run exists. Use the explicit Stop control when you intend to cancel; closing a tab or losing the connection does not necessarily stop generation. Recent activity provides saved conversations and other recent work; it is not the Word conversation list.

Optional web search is controlled under Settings → Features and applies to Assistant/project chats. CourtListener can be connected for US case law. These tools do not establish Canadian legal coverage or the planned Verified/Unverified/Contradicted/Unavailable CiteCheck workflow. See [web search](../engineering/web-search.md) and [CourtListener](../engineering/courtlistener.md).

## Review documents in a table

Open Workflows → Reviews or a project's review area, select authorized documents and configure the extraction questions. Inspect generated cells and their cited evidence. Missing/failed extraction must not be interpreted as a negative legal finding.

Review chat and generation have different permissions and execution paths. The selected instance may use queued extraction. Do not assume that closing the page cancels the job or that every asynchronous job supports the same Stop behaviour. See [generation contracts](../engineering/backend-architecture.md#tabular-review-generation).

## Draft and use playbooks

Open Library → Playbooks to author rules or import a supported negotiation guide. Inspect compiled rules, preferred/fallback positions and source references before running a contract review. Manually authored rules do not have imported source references. Reviews retain saved-rule snapshots, so editing a playbook is distinct from rerunning a review.

Inspect proposed document edits and accept/reject them deliberately in the applicable editor/client. Existing drafting tools do not establish the proposed Folio reviewer-approval workflow. See [playbooks](../engineering/playbooks.md).

## Reuse workflows and control memory

Use Workflows for reusable Assistant or tabular instructions/assets permitted in your workspace. Check the intended inputs, model and tool requirements before running one. Pack/catalogue availability does not establish a general marketplace or sandboxed plugin platform.

Settings → Memory controls optional user/workspace memory; projects can have shared memory. Inspect or edit it when needed. Memory is reference context, not legal evidence or a permission override. Updates can occur after a conversation becomes quiet rather than during the live answer. See [memory controls](../engineering/memory.md).

## Connect external services and approve actions

In Settings → Connectors, select the correct workspace, browse Discover or add an authorized custom server. Complete the service's consent flow and inspect its enabled tools. Google sign-in is separate from connecting Drive, Gmail or Calendar.

Check read-only and approval settings before allowing writes. When a proposal requires approval, inspect the exact recipient, content or other action details and approve or reject it explicitly. Changing/deleting a connection may invalidate pending actions. MCP, Google Drive, Gmail and Calendar settings can allow writes without approval; do not assume that every external write will present a confirmation.

Word and Tabular Reviews cannot show the required MCP write approval interface and refuse those actions. See [connector controls](../engineering/connectors.md#write-actions-and-approvals) and [Google Workspace](../engineering/google-workspace.md).

## Download and export

Use the relevant document/project export controls for content you are authorized to access. Project manifests can record document-version hashes and accept/reject history. Hashes or optional signatures prove specific integrity properties; they do not certify the document's legal accuracy or approval status. Some older versions have no recorded hash and remain unverifiable. See [export verification](../engineering/tamper-evident-exports.md).

## Use Word or desktop

The [Word task pane](../../apps/word-addin/README.md) supports document-aware chat, workflows, quick actions and tracked edits. It currently uses the Personal workspace; organization documents and workflow assets cannot be attached. Word chat history is separate from web Assistant history. Follow the client guide for HTTPS and sideloading.

The [desktop client](../../apps/desktop/README.md) provides native window/connection behaviour and a macOS local-mode configuration. Installed package capabilities, model setup, native conversion dependencies and signing vary. Ask the administrator which client and release have been accepted for your use.

## When something fails

Check the workspace, item access, provider availability and document processing state first. Keep the safe error message and request identifier for support. Do not include API keys, auth cookies or client document contents in a screenshot/log attachment. The [administrator guide](administrator.md) and [troubleshooting guide](../engineering/troubleshooting.md) cover operational investigation.

## Planned legal workflow

The [implementation plan](../07-implementation/NorthWrit-Implementation-Plan.md) schedules the coherent Matter workspace, Canadian research, Bearings, four-state CiteCheck, Shield and version-bound Folio approvals. Those requirements are described in [workflow contracts](../04-specs/Northwrit_Workflow-Contracts.md) and are not instructions for current controls. See the [capability matrix](../04-specs/NorthWrit-Capability-Matrix.md) for the distinction between existing building blocks and remaining acceptance work.
