# NorthWrit capability matrix

Reviewed November 14, 2026 at baseline `7c08dba`. This matrix accounts for all 105 requirements in the [feature specification](Northwrit_Feature-Spec.md). It connects them to existing capability areas and the [delivery disposition](../07-implementation/NorthWrit-Feature-Disposition.md); it does not mark those requirements as implemented or accepted.

## Interpretation

- **Candidate capability:** the disposition identifies a reuse candidate; the complete requirement still needs verification.
- **Related building blocks:** implementation exists in the surrounding area, but adaptation and requirement-specific acceptance remain.
- **Planned requirement:** the required capability/policy is not established by the current baseline. Related infrastructure is not proof of completion.
- **Deferred:** retained in the product backlog after the pilot.

Priority P0/P1/P2 is product scope, not a phase number. Phase is the existing disposition's delivery allocation, not a new implementation commitment. Source links below identify the relevant capability area, not evidence that every feature in that area is complete. The [product catalogue](../02-product/NorthWrit-Product-Catalogue.md) describes actual surfaces and client/configuration limits. No requirement is promoted to accepted by this documentation review.

## Assist

Assistant, project chat, source viewers, model selection and workflows.

References: [catalogue](../02-product/NorthWrit-Product-Catalogue.md#assistant-history-and-research), [implementation or guide](../../apps/api/src/modules/chat/).

| ID | Requirement | Priority | Current coverage assessment | Delivery allocation |
|---|---|---|---|---|
| AS01 | Pinpoint Cites | P0 | Related building blocks | 4 |
| AS02 | Model Picker | P0 | Related building blocks | 4 |
| AS03 | Save to Matter | P0 | Related building blocks | 4 |
| AS04 | Prompt Library | P1 | Related building blocks | 6 |
| AS05 | Specialists | P1 | Related building blocks | 6 |
| AS06 | My Style | P1 | Related building blocks | 6 |
| AS07 | Dictate | P2 | Deferred | After pilot |

## Research

Optional web search and US case-law tooling; Canadian legal scope and citation evaluation remain to be delivered.

References: [catalogue](../02-product/NorthWrit-Product-Catalogue.md#assistant-history-and-research), [implementation or guide](../engineering/web-search.md).

| ID | Requirement | Priority | Current coverage assessment | Delivery allocation |
|---|---|---|---|---|
| RS01 | Answer Engine | P0 | Related building blocks | 5 |
| RS02 | Bearings | P0 | Planned requirement | 5 |
| RS03 | Source Filters | P0 | Planned requirement | 5 |
| RS04 | Source Labels and Synthesis | P0 | Planned requirement | 5 |
| RS05 | CiteCheck | P0 | Planned requirement | 5 |
| RS06 | Research Memo | P0 | Related building blocks | 5 |
| RS07 | Deep Research | P1 | Related building blocks | 5 |
| RS08 | Beacon | P1 | Deferred | After pilot |
| RS09 | Triangulate | P2 | Deferred | After pilot |
| RS10 | Authority Treatment | P2 | Deferred | After pilot |
| RS11 | Dispatch | P2 | Deferred | After pilot |

## Review

Upload sessions, source versions, derived text, Library and Tabular Reviews.

References: [catalogue](../02-product/NorthWrit-Product-Catalogue.md#library-uploads-and-document-evidence), [implementation or guide](../../apps/api/src/modules/uploads/).

| ID | Requirement | Priority | Current coverage assessment | Delivery allocation |
|---|---|---|---|---|
| RV01 | Smart Upload | P0 | Candidate capability | 4 |
| RV02 | Document Versions | P0 | Related building blocks | 4 |
| RV03 | Review Grid | P1 | Related building blocks | 5 |
| RV04 | OCR and Email Ingestion | P1 | Related building blocks | 5 |
| RV05 | Auto-Sort | P1 | Related building blocks | 5 |
| RV06 | Precedent Bank | P1 | Related building blocks | 5 |
| RV07 | Portfolio Compare | P2 | Deferred | After pilot |

## Draft

Document tools, playbooks, tracked edits and the Word task pane.

References: [catalogue](../02-product/NorthWrit-Product-Catalogue.md#review-drafting-and-playbooks), [implementation or guide](../engineering/playbooks.md).

| ID | Requirement | Priority | Current coverage assessment | Delivery allocation |
|---|---|---|---|---|
| DR01 | Draft from Precedent | P1 | Related building blocks | 5 |
| DR02 | Playbooks | P1 | Related building blocks | 5 |
| DR03 | Playbook Check and Redline | P1 | Related building blocks | 5 |
| DR04 | Redline Report | P1 | Related building blocks | 5 |
| DR05 | NorthWrit for Word | P1 | Related building blocks | 6 |
| DR06 | NorthWrit for Outlook | P2 | Deferred | After pilot |
| DR07 | Translate | P2 | Deferred | After pilot |

## Matters

Projects, sharing and project memory; complete legal Matter semantics remain planned.

References: [catalogue](../02-product/NorthWrit-Product-Catalogue.md#workspaces-projects-and-access), [implementation or guide](../../apps/api/src/modules/projects/).

| ID | Requirement | Priority | Current coverage assessment | Delivery allocation |
|---|---|---|---|---|
| MT01 | Matter Workspace | P0 | Related building blocks | 4 |
| MT02 | Matter Instructions | P0 | Related building blocks | 4 |
| MT03 | Privacy Setting | P0 | Planned requirement | 5 |
| MT04 | Fact Sheet | P1 | Related building blocks | 4 |
| MT05 | Matter Templates | P1 | Related building blocks | 4 |
| MT06 | Matter Dashboard | P1 | Related building blocks | 4 |
| MT07 | Client Rooms | P1 | Planned requirement | 4 |
| MT08 | Legal Hold | P2 | Deferred | After pilot |

## Search and outputs

Stored-text search, document versions, viewers and exports; Folio approval is a separate requirement.

References: [catalogue](../02-product/NorthWrit-Product-Catalogue.md#administration-lifecycle-and-export), [implementation or guide](../engineering/document-text-search.md).

| ID | Requirement | Priority | Current coverage assessment | Delivery allocation |
|---|---|---|---|---|
| SO01 | NorthWrit Search | P0 | Related building blocks | 4 |
| SO02 | Folios | P0 | Related building blocks | 4 |
| SO03 | Review States | P0 | Planned requirement | 5 |
| SO04 | Folio History | P0 | Related building blocks | 4 |
| SO05 | Export (DOCX) | P0 | Related building blocks | 4 |
| SO06 | Export (PDF, Excel, branding) | P1 | Related building blocks | 5 |
| SO07 | Quick Jump | P1 | Deferred | After pilot |
| SO08 | Conversation Search and Saved Searches | P1 | Deferred | After pilot |
| SO09 | Timelines | P1 | Related building blocks | 5 |
| SO10 | Charts and Decks | P2 | Deferred | After pilot |
| SO11 | Calculators | P2 | Deferred | After pilot |
| SO12 | Client Brief | P2 | Deferred | After pilot |

## Agents and automation

Reusable workflows, delegated tasks, run streams and operation-specific durable jobs.

References: [catalogue](../02-product/NorthWrit-Product-Catalogue.md#workflows-tools-and-memory), [implementation or guide](../engineering/subagents.md).

| ID | Requirement | Priority | Current coverage assessment | Delivery allocation |
|---|---|---|---|---|
| AG01 | Research-to-Memo Workflow | P0 | Related building blocks | 6 |
| AG02 | Run Trail | P0 | Related building blocks | 6 |
| AG03 | Checkpoints | P0 | Related building blocks | 6 |
| AG04 | Agent Library | P1 | Related building blocks | 6 |
| AG05 | Agent Studio | P1 | Related building blocks | 6 |
| AG06 | Schedules | P1 | Planned requirement | 6 |
| AG07 | Deadline Watch and Digest | P1 | Planned requirement | 6 |
| AG08 | Intake and Triage | P1 | Planned requirement | 6 |
| AG09 | Agent Versions and Clone | P2 | Related building blocks | 6 |
| AG10 | Relay and Critic | P2 | Related building blocks | 6 |
| AG11 | Workbench | P2 | Deferred | After pilot |
| AG12 | Triggers | P2 | Planned requirement | 6 |
| AG13 | Business Self-Service | P2 | Planned requirement | 6 |
| AG14 | Flow Builder | P2 | Deferred | After pilot |

## Connections and packs

Model adapters, workspace-scoped connectors and add-on catalogue building blocks.

References: [catalogue](../02-product/NorthWrit-Product-Catalogue.md#models-and-integrations), [implementation or guide](../engineering/connectors.md).

| ID | Requirement | Priority | Current coverage assessment | Delivery allocation |
|---|---|---|---|---|
| CN01 | Provider Adapters | P0 | Related building blocks | 5 |
| CN02 | First Document Connector | P1 | Related building blocks | 6 |
| CN03 | Firm Packs | P1 | Related building blocks | 6 |
| CN04 | Connector Directory and Permission Sync | P2 | Related building blocks | 6 |
| CN05 | MCP and Enterprise APIs | P2 | Related building blocks | 6 |
| CN06 | Pack Governance | P2 | Related building blocks | 6 |
| CN07 | NorthWrit SDK | P2 | Deferred | After pilot |
| CN08 | Pack Exchange | P2 | Deferred | After pilot |

## Shield

Provider configuration, desktop configuration and diagnostics are available; comprehensive policy enforcement is not established.

References: [catalogue](../02-product/NorthWrit-Product-Catalogue.md#models-and-integrations), [implementation or guide](../06-technical/NorthWrit-Current-Implementation.md#trust-boundaries-and-operational-failure).

| ID | Requirement | Priority | Current coverage assessment | Delivery allocation |
|---|---|---|---|---|
| SH01 | Processing Policy | P0 | Planned requirement | 5 |
| SH02 | Model Gateway | P0 | Related building blocks | 5 |
| SH03 | Shield Log | P0 | Planned requirement | 5 |
| SH04 | Outbound Boundary | P0 | Planned requirement | 5 |
| SH05 | Local Companion | P1 | Deferred | After pilot |
| SH06 | Smart Routing | P1 | Planned requirement | 5 |
| SH07 | Redact and Restore | P1 | Planned requirement | 5 |
| SH08 | Desktop and Offline Mode | P2 | Deferred | After pilot |

## Security and administration

Auth, roles/access helpers, audit and organization lifecycle controls; full requirements need deployment and acceptance evidence.

References: [catalogue](../02-product/NorthWrit-Product-Catalogue.md#administration-lifecycle-and-export), [implementation or guide](../guides/administrator.md).

| ID | Requirement | Priority | Current coverage assessment | Delivery allocation |
|---|---|---|---|---|
| SA01 | Tenant Isolation and Authorization | P0 | Related building blocks | 4 |
| SA02 | Encryption | P0 | Planned requirement | 5 |
| SA03 | Multi-Factor Sign-in | P0 | Related building blocks | 4 |
| SA04 | No Training | P0 | Planned requirement | 5 |
| SA05 | Retention and Deletion | P0 | Related building blocks | 5 |
| SA06 | Rate Limits and Budgets | P0 | Related building blocks | 4 |
| SA07 | Users and Roles | P0 | Related building blocks | 4 |
| SA08 | Model Policy | P0 | Related building blocks | 4 |
| SA09 | Audit Trail | P0 | Related building blocks | 5 |
| SA10 | Single Sign-On and SCIM | P1 | Related building blocks | 6 |
| SA11 | Ethical Walls | P1 | Planned requirement | 4 |
| SA12 | Canadian Residency | P1 | Planned requirement | 5 |
| SA13 | Seats, Billing and Feature Toggles | P1 | Deferred | After pilot |
| SA14 | Insights | P2 | Deferred | After pilot |
| SA15 | SOC 2 and ISO 27001 | P2 | Deferred | After pilot |

## Customization

Existing workspace settings, preferences and workflow configuration.

References: [catalogue](../02-product/NorthWrit-Product-Catalogue.md#workflows-tools-and-memory), [implementation or guide](../02-product/NorthWrit-Product-Catalogue.md).

| ID | Requirement | Priority | Current coverage assessment | Delivery allocation |
|---|---|---|---|---|
| CU01 | Preferences | P0 | Related building blocks | 4 |
| CU02 | House Style | P1 | Deferred | After pilot |
| CU03 | Memory Controls | P1 | Related building blocks | 4 |
| CU04 | Personal Library | P1 | Related building blocks | 6 |
| CU05 | NorthWrit Mobile | P2 | Deferred | After pilot |
| CU06 | Clip to Matter | P2 | Deferred | After pilot |
| CU07 | White-label | P2 | Deferred | After pilot |

## Quality

Unit/route tests, type checks, lint and image builds; legal evaluations and live pilot acceptance remain separate.

References: [catalogue](../02-product/NorthWrit-Product-Catalogue.md#planned-legal-capabilities), [implementation or guide](../07-implementation/NorthWrit-CI-Inventory.md).

| ID | Requirement | Priority | Current coverage assessment | Delivery allocation |
|---|---|---|---|---|
| QA01 | NorthWrit Bench | P0 | Planned requirement | 7 |

## Closing a requirement

Record the exact application revision, requirement-specific positive and denied cases, configuration, executed checks and remaining limitations before marking a requirement accepted. Reconcile with the [workflow contracts](Northwrit_Workflow-Contracts.md), especially evidence invalidation, exact-payload approval, export eligibility and lifecycle handoffs. Update the implementation plan and disposition when delivery decisions change; do not infer acceptance from the existence of a screen, adapter or unit test.
