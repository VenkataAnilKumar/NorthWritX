# Phase 4D — Matter draft UI

Prepared November 17, 2026 on backend commit `07a3541`. This increment implements the manual draft editor, revision history and checked DOCX export UI for SO02/SO04/SO05. Full Phase 4 acceptance, visual comparison and Phase 5 approval remain open.

## Plan and delivered behaviour

Add **Drafts** inside an existing matter at `/projects/:id/drafts`, preserving the Documents URL and application/package boundaries. Reuse the [saved-draft contract](NorthWrit-Phase-4D-Draft-Contract.md), shared wire types, cookie-authenticated API client, matter permissions and existing UI primitives. No new dependency, migration, provider configuration or separately deployed service is needed for this UI increment.

- Editors create plain-text drafts with title, scope, assumptions and up to 50 exact source-version/hash references. The source picker uses the current matter document list, explicitly excludes unhashed sources, and supports a scoped refresh. Refresh never replaces an existing reference silently. User-entered locators are not verified citations.
- Saving appends an immutable revision. An identical retry after a network failure retains its request UUID; changed input gets a new identity. A stale base/source refusal preserves local text. Existing drafts require a deliberate reload before another save; a conflicting new draft can be retried after reviewing/changing its sources.
- Readers can inspect and export saved revisions but cannot create, edit or restore. History shows actor/time and supports pagination. Historical content is read-only; restoring rechecks sources and saves a new revision against the current pointer.
- Export always identifies the selected saved revision, excludes unsaved edits and remains **DRAFT — NOT APPROVED**. Changed/unavailable evidence disables export; a later server refusal also blocks another attempt until reload/review. The API continues checking current permissions and exact evidence before returning bytes.
- Matter/access-role changes remount the editor. Async read/save/export results and retained action callbacks cannot update an unmounted editor or trigger a late download. A synchronous operation lock prevents duplicate saves and switching while an operation is pending.
- Explicit discard confirmation covers draft/history selection, matter tabs, matter header navigation and ordinary internal links. Page close/reload uses the browser's unsaved-change warning. There is no durable unsaved-draft recovery. Browser Back/Forward, other programmatic navigation and session/access changes do not have a universal navigation blocker; save before leaving. This remains a limitation for the complete context-loss acceptance gate.

## Review and verification

The review checked optimistic bases, retry identity, source snapshot preservation, read-only access, error redaction, stale async work, pagination after a new revision and the distinct header/tab navigation paths. The UI uses labelled native fields, existing focus rings and buttons, visible statuses and wrapping source/version/hash metadata. Loading and failure states distinguish unavailable content from a genuinely empty catalogue.

| Check | Result |
| --- | --- |
| Matter draft/API client and affected regressions | 402 tests passed across five files, including 20 new draft/transport cases |
| Web architecture | Five checks passed |
| API architecture and repository dependency cycles | 25 checks passed |
| Chromium draft editor/reader and Overview editor/reader | Four scenarios passed; desktop, 390px dark mode, reduced motion, forced colors, keyboard activation and horizontal overflow covered |
| Web development/test and production type checks | Passed |
| Web lint | Zero errors; 29 existing warnings; affected-file lint clean |
| Repository and branding validation | Passed: nine workspace lock entries, 291 local links and retained reviewed provenance/compatibility exceptions |
| Whitespace and staged change review | Passed |

The browser owner scenario was rerun successfully after fixing its locator to select the visible desktop breadcrumb; the other three scenarios passed in the preceding reviewed run. The initial development-server/module-resolution and cold-route failures were test-harness issues, not accepted product behaviour. Desktop/mobile screenshots were inspected and remain disposable test artifacts outside Git.

Browser fixtures intercept the API and use synthetic data, empty browser storage and no AI credentials. Their download assertion verifies client transport/selection, not DOCX rendering or real authorization; those remain covered separately by the [real backend fresh/upgrade evidence](NorthWrit-Phase-4D-Backend-Verification.md).

## Reproduction and limits

Run the web Vitest files `useMatterDrafts.test.tsx` and `northwritApi.workProducts.test.ts`, plus affected matter/API-client regressions. Run `tests/browser/e2e/matter-drafts.spec.ts` with the Playwright `synthetic` project against the candidate web server. This spec is included in the synthetic project, rather than the account-backed project; active required CI remains governed by the [CI inventory](NorthWrit-CI-Inventory.md).

The local browser verification used system Chromium, a separate Next.js development server on port 3002 and an isolated build directory. The local config-loader import workaround and module-resolution symlink were temporary test harness changes; restore the original configuration and generated type references before final checks/commit. Existing preview services, database and production build remain untouched. No deployment, publication, live AI, push or merge is included.

An existing installation needs the backend's `20261117_01_work_products.sql` migration before this feature is rolled out. The running preview has not been migrated or upgraded. Rich text/tables, visual comparison, broader source scopes, approval/reviewer workflows, durable recovery, a connected browser-to-real-backend journey and named product/legal/security acceptance remain pending. Next prepare the selected Phase 4E two-user/two-matter acceptance package; do not label Phase 4 complete from synthetic UI tests.
