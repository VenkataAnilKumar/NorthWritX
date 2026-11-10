# API Design

> Requirements reconciliation — November 9, 2026. The [Workflow Contracts](../04-specs/Northwrit_Workflow-Contracts.md) govern review invalidation, export eligibility, lifecycle handoffs, and baseline release scope. Architectural approval does not establish implementation status.
## REST resources, gateway interface, agent tools and integrations

**Version:** 1.0 | **Date:** November 3, 2026 | **Status:** Proposed (nothing is built yet)

---

## 1. Conventions

- **Style:** JSON over HTTPS, REST resources, OpenAPI description generated from the code (supports CN07 later). Base path `/v1`.
- **Auth:** session cookie (web) or short-lived bearer token (add-ins, API, companion), always with MFA at sign-in (SA03). Service tokens for enterprise API at P2 (CN05).
- **Authorisation:** every request resolves tenant, user, and, where applicable, matter. Checks happen in the service layer on each call (SA01).
- **Idempotency:** `Idempotency-Key` header on POSTs that create runs, exports or external writes.
- **Pagination:** cursor-based. **Concurrency:** `ETag` and `If-Match` on folios and settings.
- **Long work:** return `202 Accepted` with a `run` or job resource; progress by polling or server-sent events.
- **Audit:** every state-changing call and every model call produces an audit event (SA09).
- **Rate limits:** per user and per firm; `429` with `Retry-After` (SA06).
- Feature IDs refer to the [Feature Specification](../04-specs/Northwrit_Feature-Spec.md). Related: [System Architecture](Northwrit_System-Architecture.md), [Hybrid AI Architecture](Northwrit_Hybrid-AI-Architecture.md), [Data Model](Northwrit_Data-Model.md).

## 2. REST resources

| Resource | Methods and paths | Features |
|---|---|---|
| **Session** | `POST /auth/login` (OIDC callback), `POST /auth/mfa`, `DELETE /auth/session` | SA03, SA10 |
| **Me** | `GET/PATCH /me` (preferences) | CU01 |
| **Matters** | `GET/POST /matters`; `GET/PATCH/DELETE /matters/{id}` | MT01 |
| **Matter policy** | `GET/PUT /matters/{id}/policy` | MT03, SH01 |
| **Instructions** | `GET/PUT /matters/{id}/instructions` | MT02 |
| **Members** | `GET/POST /matters/{id}/members`; `DELETE .../{userId}` | MT01, SA07 |
| **Documents** | `GET/POST /matters/{id}/documents`; `GET/DELETE /documents/{id}`; `GET /documents/{id}/versions`; `GET /documents/{id}/versions/{n}/file` | RV01, RV02 |
| **Passages** | `GET /passages/{id}` (text and locator, permission checked) | AS01 |
| **Search** | `GET /search?q=&matter=&type=` | SO01 |
| **Threads and messages** | `GET/POST /matters/{id}/threads`; `POST /threads/{id}/messages` (starts an answer run) | AS01, AS02, RS01 |
| **Research** | `POST /matters/{id}/research` (question, bearings, filters) returns a run; `GET /research/{runId}/sources` | RS01 to RS04 |
| **Runs** | `GET /matters/{id}/runs`; `GET /runs/{id}`; `POST /runs/{id}/cancel`; `POST /runs/{id}/resume`; `GET /runs/{id}/steps` | AG01, AG02 |
| **Checkpoints** | `GET /runs/{id}/checkpoints`; `POST /checkpoints/{id}/approve` (body includes payload hash); `POST .../reject` | AG03 |
| **Artifacts** | `GET/POST /matters/{id}/artifacts`; `GET/PATCH /artifacts/{id}`; `GET /artifacts/{id}/versions`; `GET /artifacts/{id}/versions/{n}`; `POST .../restore`; `GET /artifacts/{id}/compare?from=&to=` | SO02, SO04 |
| **Review** | `POST /artifacts/{id}/versions/{n}/submit`; `.../request-changes`; `.../approve` | SO03 |
| **Citations** | `GET /artifacts/{id}/versions/{n}/citations`; `POST /citations/{id}/review` | RS05 |
| **CiteCheck** | `POST /artifacts/{id}/versions/{n}/citecheck` returns a run | RS05 |
| **Exports** | `POST /artifacts/{id}/versions/{n}/exports` (format `docx`; `pdf`, `xlsx` at P1); `GET /exports/{id}` | SO05, SO06 |
| **Matter export** | `POST /matters/{id}/exports` (JSON plus files) | Portability |
| **Models** | `GET /models` (those allowed to the user, with provider and region) | AS02, SA08 |
| **Shield Log** | `GET /matters/{id}/shield-log`; `GET /admin/shield-log` | SH03 |
| **Audit** | `GET /matters/{id}/audit`; `GET /admin/audit`; `POST /admin/audit/exports` (P1) | SA09 |
| **Admin policy** | `GET/PUT /admin/firm-policy`; `GET/PUT /admin/model-policy`; `GET/PUT /admin/retention`; `GET/PUT /admin/budgets` | SH01, SA05, SA06, SA08 |
| **Users** | `GET/POST /admin/users`; `PATCH /admin/users/{id}` (role); SCIM at `/scim/v2/*` (P1) | SA07, SA10 |
| **Ethical walls** | `GET/POST /admin/ethical-walls` | SA11 |
| **Library** | `GET/POST /library/items` | RV06, DR02 |
| **Agents** | `GET /agents`; `POST /agents/{id}/runs` (P1 for studio) | AG04, AG05 |
| **Companion** | `POST /companion/register`; `GET /companion/policy`; `POST /companion/sync` (metadata allowed by policy) | SH05 |
| **Health** | `GET /healthz`, `GET /readyz` (no tenant data) | |

At P0, the agent resources are limited to the fixed research-to-memo workflow (AG01).

**Representative request: start research**

```json
POST /v1/matters/{matterId}/research
{
  "question": "Is the supplier entitled to terminate for convenience?",
  "bearings": {
    "jurisdiction": "CA-ON",
    "relevant_date": "2026-06-30",
    "side": "client",
    "material_facts": ["Agreement dated 2024-01-15 with 60-day notice clause"]
  },
  "source_filters": { "types": ["case", "statute"], "courts": [], "date_from": null },
  "include_matter_documents": true,
  "model": "firm-default"
}
```

If `bearings` is incomplete the API responds `422` with `error.code = "bearings_required"` and the missing items. It never fills them in (RS02).

**Representative response: citation**

```json
{
  "id": "c_81f",
  "anchor": {"block": "b12", "start": 40, "end": 128},
  "evidence_kind": "public_source",
  "source": {"provider": "canlii", "ref": "<neutral citation>", "retrieved_at": "2026-11-03T21:10:00Z", "locator": "para 42", "jurisdiction": "CA-ON"},
  "resolution_status": "resolved",
  "support_label": "verified",
  "checked_by": {"run_id": "r_22a", "model": "<model>", "provider": "<provider>"}
}
```

## 3. Error model

All errors use one envelope. Messages are written for users; machine fields are stable.

```json
{
  "error": {
    "code": "blocked_by_policy",
    "message": "This step would send matter excerpts to a provider outside Canada, which the matter policy does not allow.",
    "request_id": "req_9c1",
    "details": {
      "rule_id": "matter.region.canada_only",
      "category": "excerpt",
      "destination": {"provider": "<provider>", "region": "us"},
      "policy_version": 7,
      "alternatives": [
        {"action": "run_locally", "available": false, "reason": "No local runtime registered"},
        {"action": "narrow_sources", "available": true},
        {"action": "request_policy_change", "available": true}
      ]
    }
  }
}
```

| HTTP | `code` | Meaning |
|---|---|---|
| 400 | `invalid_request` | Malformed or invalid fields. |
| 401 | `unauthenticated`, `mfa_required` | Missing or expired credentials. |
| 403 | `forbidden`, `ethical_wall` | Authenticated but not permitted. Ethical-wall responses do not reveal matter existence beyond what the user may know. |
| 404 | `not_found` | Also returned for objects the user may not see. |
| 409 | `version_conflict`, `approval_invalidated`, `state_transition_invalid` | Concurrency or review-state conflicts. |
| 413 / 415 | `file_too_large`, `unsupported_type` | Upload limits. |
| 422 | `bearings_required`, `validation_failed` | Required inputs missing. |
| 423 | `legal_hold` | Operation blocked by hold (P2). |
| 429 | `rate_limited`, `budget_exceeded` | Per-user, per-firm or task budget (SA06). |
| **403 or 409** | **`blocked_by_policy`** | Shield blocked a step. Proposed: `403` for a synchronous call, and a `blocked` step status inside a run (the run itself returns `200` with `status: partial` or `awaiting_policy`). |
| 424 | `source_unavailable` | An upstream source failed; response includes partial results and the named gap. |
| 502 / 503 | `provider_unavailable`, `service_unavailable` | Retryable; run is resumable. |

**Blocked-by-policy rules:** the response always carries `rule_id`, `category`, `destination` and `alternatives`; it never includes payload text. A run reports blocked steps as data, so a client can show the gap.

**Partial results:** responses with gaps carry `gaps: [{"kind": "source_unavailable"|"blocked"|"ingest_failed", "name": "...", "reason": "..."}]` so nothing fails silently.

## 4. Model Gateway interface (internal, SH02)

Not exposed publicly. Services call it in-process or by internal RPC.

```
ModelGateway.complete(request) -> response
request {
  tenant_id, matter_id, user_id, run_id?, step_id?,
  purpose: "answer" | "draft" | "citecheck" | "classify" | "extract" | "embed",
  capability: "chat" | "structured" | "embedding" | "vision",
  model_hint?: adapter_id,            // user choice, still subject to policy
  messages | inputs,                  // content by reference where possible
  untrusted_segments[],               // offsets of retrieved text, marked untrusted
  response_schema?,
  budget { max_tokens, max_cost }
}
response {
  output, usage { input, output, cost },
  model, provider, region, location: "cloud" | "local",
  shield_decision_id, shield_log_id?
}
errors: blocked_by_policy | budget_exceeded | provider_unavailable | invalid_output
```

Properties: no call without a Shield decision; usage and identity always returned; structured output is validated before it is used; `embed` is treated as an outbound category.

## 5. Tool Gateway and agent tool interface (AG01 to AG03, CN01)

Tools are the only actions an agent can take. Each is registered with a manifest.

```
Tool manifest {
  name, version, description,
  input_schema, output_schema,
  side_effect: "none" | "read_external" | "write_external" | "write_internal",
  data_categories_out[],              // for the outbound boundary
  destination { type, provider, region },
  requires_approval: bool,            // always true for write_external
  allowed_roles[], allowed_matter_modes[],
  idempotent: bool
}
```

**Core tools (P0):** `search_matter(query, filters)`, `read_passage(id)`, `search_sources(query, filters)`, `fetch_source(ref)`, `resolve_citation(ref)`, `check_support(claim, passage)`, `create_folio(kind, content)`, `update_folio(id, patch)`.

**Rules**

1. A run may call only tools permitted for the matter and the initiating user. Tool credentials are scoped; the model never sees secrets.
2. Parameters are validated against the schema, then checked by the outbound boundary.
3. Tool results are tagged **untrusted** and cannot change the run's permissions, policy or tool list. A model-proposed call outside the allow-list is rejected and logged.
4. `write_external` tools create a checkpoint holding the exact payload and its hash. The approval API accepts only that hash; a changed payload needs fresh approval (AG03).
5. Every call has an idempotency key; a retry cannot duplicate a message, document or update.
6. Cancellation prevents new calls but leaves completed step records.
7. Limits: maximum steps, tool calls, tokens, cost and wall time per run (SA06).

## 6. Webhooks (P1 and later)

| Aspect | Proposal |
|---|---|
| Events | `document.indexed`, `document.failed`, `run.completed`, `run.blocked`, `artifact.submitted`, `artifact.approved`, `deadline.due` (AG07). |
| Payload | Identifiers, event type and status only; no matter text. Receivers fetch details through the API with their own credentials. |
| Security | HMAC signature header, timestamp and replay window, per-endpoint secret, admin-registered endpoints, allow-list of destinations. |
| Delivery | At-least-once with retry and backoff; event ids for de-duplication. |
| Governance | Webhook destinations are data-exit paths: registered, audited, and subject to firm policy. |

## 7. MCP and enterprise APIs (P2, CN05)

- **Northwrit as MCP client:** MCP servers are registered as tools through the Tool Gateway with a manifest, so they inherit approval, outbound-boundary and audit rules. MCP tool output is untrusted.
- **Northwrit as MCP server (optional):** exposes permission-scoped read tools (search, fetch passage, list matters) to approved clients, using the user's identity, never a broader service identity.
- **Enterprise API:** the REST resources above, with OAuth client credentials limited to named matters and scopes. Pack tools follow CN03 and CN06: never more access than the running user.
- No MCP or API client can bypass Shield. A call that would break policy returns `blocked_by_policy`.
- Details of the protocol version and authorisation flow to be confirmed at implementation time.

## 8. Versioning and change

Breaking changes go in a new path version. Deprecations are announced with a stated period. The OpenAPI document is part of the release gate alongside Northwrit Bench (QA01).
