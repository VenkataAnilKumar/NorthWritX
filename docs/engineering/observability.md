# Error tracking with Sentry

Every NorthWrit runtime can report unexpected failures to [Sentry](https://sentry.io)
(or any Sentry-compatible endpoint, including a self-hosted instance):

| Runtime | SDK | Enabled by |
| --- | --- | --- |
| Backend API process | `@sentry/node` | `SENTRY_DSN` in `backend/.env` |
| Backend worker thread / standalone worker / one-shot jobs | `@sentry/node` | same `SENTRY_DSN` (one project for the whole backend) |
| Web app, in the browser | `@sentry/nextjs` | `NEXT_PUBLIC_SENTRY_DSN` at **build** time |
| Web app, Next.js server (the `/api` gateway) | `@sentry/nextjs` | `SENTRY_DSN` in the frontend's runtime environment |
| Word add-in (task pane, ribbon commands, OAuth dialog) | `@sentry/react` | `REACT_APP_SENTRY_DSN` at **build** time |

**Off without a configured destination.** NorthWrit ships no upstream Sentry DSNs. Set `SENTRY_DSN` for the API, `FRONTEND_SENTRY_DSN` for Compose's Next server, or `REACT_APP_SENTRY_DSN` for the Word build to opt into your own project. `SENTRY_DISABLED=true` always disables reporting.

The browser SDK uses a local carrier DSN (`https://northwrit@northwrit.local/1`) and the same-origin `/monitoring` tunnel. This address is a placeholder, never the outbound reporting destination. The server discards envelopes when no DSN is configured and forwards only to its configured project. Runtime configuration can enable reporting without rebuilding the browser.

Before sending, every runtime filters document content, credentials and request data through the existing privacy boundary. The [historical upstream guide](../upstream/original-source/OBSERVABILITY.md) preserves the earlier account audit; it does not describe a NorthWrit account or an active release pipeline.

### Quota protection and its limits

Per-issue throttling, privacy filtering and occurrence budgets remain in the backend and shared client scrubbers. Configure provider-side limits in your own Sentry account. NorthWrit makes no claim about an upstream account's present quota, filters or billing state.

## What gets reported

The goal is that a bug shows up as a Sentry issue the first time it happens,
with enough context to reproduce it, and that the same bug groups as one issue
however many users hit it.

**Backend**

- Every unexpected 5xx. All route handlers answer server failures through
  `sendInternalError`, which reports the original error with the mounted
  Express route pattern (`/projects/:projectId`, so one bug is one issue
  however many projects it hits), the HTTP method, the status, and the
  `request_id` that the client receives in the response
  body and the `X-Request-ID` header (exposed to cross-origin scripts). A handler that
  writes its own 5xx body is caught by the response sanitizer and reported as
  a message.
- Model streams that fail after the response has started (the 500 path never
  sees these). Deliberate, explained refusals (`UserFacingError`: missing API
  key, disallowed model) are not bugs and are not reported.
- Background jobs: every failed attempt of a `db_jobs` job (warning while
  retries remain, error when exhausted), failure-hook crashes, unknown job
  kinds, claim/tick/retention failures, BullMQ conversion/extraction/delivery
  failures, upload-session processing and conversion failures, worker
  heartbeat and loop failures, and the maintenance sweeps.
- Playbook reviews and imports (`component=playbooks`, split by `stage`:
  `import.read` … `import.save`, `review.model`, `review.apply_edits`,
  `review.save`, `heartbeat`, the `*.record` writes of a failure, staged
  upload cleanup, and `job.terminal` for an in-process job with the runner
  off). Tags add `job_kind` and, for imports, `file_type`; `extra` holds only
  `run_id`, `import_id`, and `playbook_id`. Refusals the user is shown (a bad
  file, a missing or rejected key, no access) are not reported; model output
  still invalid after the automatic recompile, timeouts, and provider errors
  are warnings; crashes and storage or database failures are errors.
- Process lifecycle: boot configuration failures, worker-thread crashes and
  respawns, graceful-shutdown errors, workflow-sync job failures. Unhandled
  promise rejections are reported and then still exit the process, exactly
  as Node does with reporting disabled; enabling Sentry never changes how
  the process lives or dies.
- Best-effort work that must not fail its caller but must not vanish either:
  storage deletes during rollbacks, cancelled uploads, and expiry sweeps go
  through `deleteFileBestEffort(key, stage)` and are reported as warnings
  grouped by stage. Use `bestEffort(promise, { what })` for the same shape
  elsewhere instead of `.catch(() => {})`.
- Everything else that reaches `console.error`, via Sentry's console bridge.
  The same error object already reported explicitly is recognised and not
  sent twice; unrelated console messages do not share that identity.
- Node's own process warnings (`DeprecationWarning`, `ExperimentalWarning`,
  `MaxListenersExceededWarning`, …), as warnings tagged
  `component=runtime-warning` with `warning_name` and, for deprecations, the
  `warning_code` (`DEP0040`), grouped per name and code. Node prints these
  through `console.error` from its own internals, so through the bridge alone
  they arrived as a context-free "Failure in application"; the printed copy is
  now dropped and the warning object, whose stack names the module that
  raised it, is reported instead. `--no-warnings` silences this too.

Backend events carry `service=northwrit-api` and `role` (`api`, `worker`,
`worker-thread`, or `job`). Every API request starts its own isolation scope
before parsing, authentication or routing, with `component=http`, the fallback
`operation=http.request`, HTTP method, sanitized route and generated request ID.
Domain `setOperation` calls replace that fallback. Thus a leftover console error
or an early middleware failure still identifies its request without a log lookup.
Only fixed route segments survive; resource names, IDs and query strings do not.
User identity is removed by the final transport in both installation modes.

Row extraction in a queue leaves failure reporting to the runner, once per
failed attempt with the runner's retry severity. Inline row streams report at
the query boundary. Optional storage reads retain default stack grouping and
failure-kind/code tags; the raw `best-effort` fingerprint does not override that
at the final boundary. Required export reads propagate storage failures rather
than publishing an apparently successful ZIP with an unreadable file omitted.

Error objects retain repository-relative code paths, line and column numbers;
a nested Error logged through the console keeps its original stack location.
Plain strings and database error objects have no original stack, so their event
identifies the reporting line instead. Preserve the original Error as `cause`
when wrapping a failure; an overwritten or discarded stack cannot be recovered.
Source locations are code filenames, never uploaded document names. Production
source mapping still depends on the release/source-map configuration below;
minified browser frames cannot promise an original TypeScript line without it.

**Web app**

- Uncaught exceptions and unhandled promise rejections in the browser (SDK
  default), the route error boundary (`error.tsx`), and the root boundary
  (`global-error.tsx`).
- Every backend 5xx seen by the API client, with a controlled title containing component, method, route and status with the backend's `request_id` — search `request_id:<id>` in Sentry
  to see both halves of one failure. 4xx are intentional answers to user input
  and are shown, not reported.
- Requests that never reached the server (backend down, mid-deploy, network),
  as warnings grouped per endpoint rather than one "Failed to fetch" issue.
  Deliberate cancellation (an aborted signal or `AbortError`) is not reported.
- Assistant chat streams that fail for a reason other than the user stopping
  them.
- Server side: gateway failures to reach the backend, and render/route-handler
  errors through Next's `onRequestError` hook.
- Everything else that reaches `console.error`, deduplicated as above. An
  error reported explicitly is also not filed a second time if the same
  object then escapes to the browser's unhandled-error or rejection handler.

**Word add-in**

- Uncaught errors in the pane, plus a React error boundary around the whole
  pane that shows a "Try again" fallback instead of a blank pane.
- Backend 5xx (with `request_id`), transport failures that never reached the
  server (warning level, grouped per endpoint: the most common failure users
  see in Word and the hardest to diagnose), mid-stream chat failures, and
  tool-result delivery failures.
- Office.js failures while reading, anchoring, resolving, restoring, or
  revealing a tracked change (`component=word-office`, grouped by `stage`
  and by Word's own error code). Documented stale-proxy fallbacks that the
  code retries are control flow and are not reported.
- Office host tags (`office_host`, `office_platform`, `office_version`) so a
  bug that only reproduces in Word on Mac 16.x or Word on the web is
  identifiable.

## Outbound privacy boundary

`sendDefaultPii: false` and the original `beforeSend` scrubber provide defense
in depth, but neither is the final guarantee: SDK session items bypass
`beforeSend`. `privacyBoundaryIntegration` wraps the installed SDK transport
and rebuilds the complete envelope before serialization. It is installed in
the backend, Next server/edge, browser, and all Word add-in entries.

- Only error `event` items may leave. Sessions (including authenticated `did`),
  client reports, attachments, replay, traces, logs, metrics and unknown future
  item types are dropped locally without a network request.
- Error/console prose is replaced with a description made from approved
  operation, component, stage, error-kind, method, normalized route, status,
  and error-code values. For example:
  `Failure in documents.upload.complete / upload-worker / process-file / conversion.no_output`.
  Static exception constructor names, relative source-code locations and
  function names on our own frames remain. Before serialization, the
  reporter checks exception types against the actual Error constructors in
  the cause chain; an SDK's mutable `Error.name` is not evidence of a class
  name. Node's fixed warning categories are also retained. Function names
  are trusted under the source contract below, with dependency frames
  excluded even when `node_modules` sits inside an application directory.
- Request data, headers, cookies, URLs and queries are absent. Routes retain
  only fixed endpoint vocabulary; other segments become `:id`.
- User objects, machine details, arbitrary contexts, source snippets, frame
  locals, custom tags and free-form extras are absent. Of breadcrumbs only
  the stage trail survives (`markStage`, category `northwrit.stage`): static stage labels, with timestamps, never a message or data. Correlation/domain IDs are allowed only under named keys and
  only in UUID format. IDs remain linkable to internal records; this is data
  minimization, not a claim of anonymity.
- Finite failure codes, dependency HTTP status, storage operation, file type,
  capture source, build mode and `diagnostics_version` remain. Wrapped and
  aggregate causes and AI SDK `lastError` are inspected locally with bounded
  traversal. Known provider error classes become a finite `provider_error`
  category; response bodies, prompts and credentials are never retained.
  Browser fetch failures include only `network_state` (online/offline/unknown)
  and `request_origin` (same-origin/cross-origin/unknown), never the hostname.
  Online means the browser reports connectivity, not that a server is reachable. Arbitrary
  codes/names/messages and dependency metadata are not transmitted.
- Invalid configuration reports may name approved environment **fields**, never
  their values. Converter failures distinguish missing binary, timeout and
  nonzero exit without sending stderr or document paths.
- Browser/runtime contexts retain only approved software names and numeric
  versions; user-agent strings, device identity and other context fields are
  excluded. Message captures explicitly request stacks; the same path-only
  filtering applies to those frames.
- Opt-in pipeline probes carry `diagnostic_test:true` and a controlled test
  title so they can be separated from real failures.
- Controlled Office host/platform/version tags remain. Source-map debug IDs
  and code-file locations remain so uploaded source maps can resolve frames.
  Source-map uploads themselves are a separate operator-enabled transfer of
  application source code.
- The same restrictions apply to `install=official` and `install=community`.
  An install label does not enable transmission of client information.

Do not put customer names in operator-supplied release/environment values.
Those values identify the deployed software and are sent with reports.
Performance tracing settings do not bypass the error-only transport boundary;
tracing is unsupported until a separate outbound policy is reviewed.

The boundary is mirrored in `backend/src/lib/observability/sentryPrivacy.ts`
and `packages/client/src/sentryPrivacy.ts`, with a synchronization test.
When adding diagnostics, extend reviewed enum/ID fields and their tests. Do not
add free-form text just to restore a more detailed exception message.

## Configuration

Backend (`backend/.env`, read at process start):

```
SENTRY_DISABLED=                       # empty = image default; true = off; false = explicitly on
SENTRY_DSN=                            # your own Sentry; empty = reporting off unless an image DSN was explicitly configured
SENTRY_INSTALL=                        # "official" only on NorthWrit's own deployment
SENTRY_ENVIRONMENT=production          # defaults to self-hosted (development when run from source)
SENTRY_RELEASE=northwrit@1.4.0              # optional; defaults to northwrit@<NORTHWRIT_VERSION>+<sha12>
SENTRY_TRACES_SAMPLE_RATE=0            # optional, 0..1
SENTRY_ENABLE_TEST_ROUTE=false         # see "Verifying" below
```

Do not add `SENTRY_DSN` to the `environment:` block of the backend service in
`docker-compose.yml`: that block overrides `env_file`, and an unset host
variable would blank the value from `.env`. Put it in `backend/.env` or the
compose-root `.env`.

The backend image stores its reporting defaults in `NORTHWRIT_BUILD_SENTRY_DSN`
and `NORTHWRIT_BUILD_SENTRY_DISABLED`. A non-empty runtime `SENTRY_DSN` or
`SENTRY_DISABLED` overrides the corresponding default; empty values preserve
it. Leave `NORTHWRIT_VERSION` and `GIT_SHA` commented in the sample `.env` when
using published images so their baked release identity survives `env_file`.
Without a version the release is `northwrit@0.0.0` (plus `+<sha12>` if available).

Web app. One runtime setting on the Next server decides where every web-app
report goes, the server's own and the browser's: the browser SDK always starts
with a placeholder DSN, and every envelope it produces goes to the Next
server's `/monitoring` route, which applies the same rule and forwards. The
published images therefore need no build-time configuration at all:

```
# root .env (Docker Compose); the Next server reads these at runtime
SENTRY_DISABLED=                       # empty = image default; true = off; false = explicitly on
FRONTEND_SENTRY_DSN=https://<key>@<org>.ingest.sentry.io/<project>
SENTRY_ENVIRONMENT=production
SENTRY_INSTALL=                        # "official" only on NorthWrit's own deployment

# building the frontend yourself (optional): build-time defaults
NEXT_PUBLIC_SENTRY_DISABLED=true       # server/tunnel default to off; runtime false re-enables both
NEXT_PUBLIC_SENTRY_DSN=...             # used when SENTRY_DSN is not set at runtime
```

Check which rule applied on a running deployment: the boot log line
`[sentry] web app reports → ...`, or `curl -s https://<host>/monitoring`, which
answers `{"reports":"disabled"|"runtime"|"build"|"default"}` (with
`"disabledBy":"runtime"|"build"` when off) and never the DSN. An explicit
runtime `SENTRY_DISABLED` (`true` or `false`) always wins over the image's baked
default; the shipped `.env.example` leaves it empty to preserve that default,
including a fork image's baked opt-out.

The `/monitoring` route is not an open relay: the destination is the server's
own configuration, the client's envelope header is overwritten with it, and a
malformed operator DSN drops envelopes rather than falling back upstream.

Use a separate Sentry project for the web app and the backend: separate issue
streams, separate source maps, and the frontend DSN is public in the bundle.

### Releases

Every event carries a release so Sentry can flag a regression in a release and
resolve an issue "until the next release". The release is
`northwrit@<version>+<sha12>`: the product version from `/VERSION` plus the commit,
in Sentry's `package@version+build` form, so releases order by version (an old
self-hosted install reporting late sorts where it belongs, not after the fix)
while the build metadata still names the exact commit. The same string is
produced by every runtime (`packages/client/src/sentryEvent.ts`,
`backend/src/lib/observability/sentry.ts`) and by both source-map build plugins
(`packages/client/src/releaseName.cjs`), so uploaded maps attach to the
release the events carry.

Where the parts come from:

| Build | Release | Image tags |
| --- | --- | --- |
| `v<VERSION>` tag, published by CI | `northwrit@2.1.0+<sha12>` | `2.1.0`, `latest` |
| push to `main`, published by CI | `northwrit@2.1.0-dev.<run>+<sha12>` | `2.1.0-dev.<run>`, `main` |
| your own `docker compose build` with `NORTHWRIT_VERSION=$(cat VERSION) GIT_SHA=$(git rev-parse HEAD)` | `northwrit@2.1.0+<sha12>` | local |
| your own build without them | `northwrit@0.0.0+<sha12>` or `northwrit@0.0.0` | local |

`0.0.0` is deliberate: a build that did not come from the release workflow is
valid but visibly not a release, and the backend warns about it at boot in
production. Set `NORTHWRIT_VERSION` and `GIT_SHA` as build arguments for images you
build yourself; leave them unset at runtime when using published images so
the baked identity is preserved. Runtime `SENTRY_RELEASE` overrides the whole
string for the backend and Next server only. In a pulled web image the browser
keeps its build-time release (`NEXT_PUBLIC_SENTRY_RELEASE`, or the baked
version and commit); the tunnel does not rewrite it. Changing the browser's
release requires rebuilding with `NEXT_PUBLIC_SENTRY_RELEASE` (Compose passes
`SENTRY_RELEASE` to that build argument). Leave runtime `SENTRY_RELEASE` unset
on published images to keep all runtimes on their baked release. Release
overrides must not contain customer information.

Each release uses the original image digests. The workflow retains each build
in GHCR as `northwrit-{api,web}:build-<version>`, with the source commit and
version in its image labels. It builds only after a registry lookup confirms
the image is absent; authentication, network and unexpected registry errors
stop the run. An existing version must match its saved build exactly.

All refs share one workflow concurrency group so publications cannot interleave
their `latest` or `main` updates. `queue: max` preserves up to 100 pending runs;
additional runs beyond that limit are canceled and must be rerun. Only
main-branch builds update `main`. After
both builds succeed, publication attaches both immutable version tags, then
the floating tags, then finalizes the Sentry release for both projects. Registry
writes across repositories are not atomic: an interrupted publication can leave
some tags attached. Rerun the failed jobs or the full workflow to finish it;
both paths reuse the saved digests, accept matching existing tags, and complete
missing writes without rebuilding. Recovery does not depend on expiring Actions
artifacts. Keep the `build-<version>` registry tags; exclude them from cleanup.
If a published version loses its saved build, the workflow refuses to rebuild it.
It records no deploy: publishing an image is not deploying it.

Word add-in (build time, `word-addin/.env` or the Docker build arguments):

```
REACT_APP_SENTRY_DISABLED=true         # opt-out
REACT_APP_SENTRY_DSN=...               # your own Sentry; empty = reporting off
REACT_APP_SENTRY_ENVIRONMENT=...       # optional
REACT_APP_SENTRY_RELEASE=...           # optional
```

### Readable stack traces (source maps)

Production bundles are minified. Without source maps a frontend issue's
culprit reads `_next/static/chunks/0vffwuerb8hxi.js:1:6381` and Sentry cannot
say which component threw. Sentry matches a frame to its map by the debug ID
stamped into the bundle at build time, so only the exact bundle that was
uploaded resolves: a rebuild elsewhere, however similar, does not. That is why
the published images exist (`docs/deployment.md`, "Running the published
images"): CI builds each release once, uploads its maps, and publishes that
bundle, so every deployment running the official image gets readable frames
without holding any Sentry credential.

Building yourself, provide upload credentials at build time; the build then
uploads the maps to Sentry and deletes them from the output so they never ship:

```
SENTRY_AUTH_TOKEN=...   # organization auth token, see below
SENTRY_ORG=...          # organization slug
SENTRY_PROJECT=...      # project slug: the web app's, or the add-in's
```

Applies to `next build` (frontend) and `webpack --mode production` (add-in).
Without all three variables the build is unchanged and nothing is uploaded.
The backend needs no upload: `tsc` emits source maps next to the compiled
files and the process runs with `--enable-source-maps` (the `start` script,
and `NODE_OPTIONS` in the Dockerfile), so backend frames already read
`src/lib/x.ts:line`.

The build plugin stamps each bundle with a debug ID and uploads the maps
under it, so frames resolve regardless of the release name; the release tag on
events still comes from `NORTHWRIT_VERSION` and `GIT_SHA`, or the explicit
`SENTRY_RELEASE` override, as described above.

#### Setting it up in Sentry

1. Open the Sentry organization, then **Settings → Developer Settings →
   Organization Tokens** (older UI: **Settings → Auth Tokens**) and create a
   token. Organization tokens carry only the `org:ci` scope (release and
   artifact upload), which is all this needs. Copy the token once; it is not
   shown again.
2. Note the organization slug (in the URL, `https://<org>.sentry.io`) and the
   project slug (**Settings → Projects**). The web app and the Word add-in are
   separate projects, so they need separate builds with their own
   `SENTRY_PROJECT`.
3. Treat the token as a deploy secret: it may create releases and upload
   artifacts for every project in the organization. Rotate it from the same
   page if it leaks.

#### Passing it to the image build

The token is read from a BuildKit secret, never a build argument, so it does
not end up in the image layers or `docker history`. `SENTRY_ORG` and
`SENTRY_PROJECT` are ordinary build arguments.

Docker image uploads are opt-in: set `SENTRY_UPLOAD_ENABLED=1`. This
non-secret build argument changes the build cache key when uploads are enabled,
so a previously tokenless build is rebuilt. The default is `0`; tokenless
builds keep working. When the enabled build step executes, a missing token,
organization or project fails the build instead of silently skipping upload.
A cache hit skips that step and its credential validation.

Docker Compose (Dokploy and similar): put these non-secret settings, plus
`NORTHWRIT_VERSION` and `GIT_SHA` for the release identity, in the compose-root
`.env` or the platform's environment; `docker-compose.yml` forwards them to the
frontend build:

```
SENTRY_UPLOAD_ENABLED=1
SENTRY_ORG=<org slug>
SENTRY_PROJECT=<web app project slug>
NORTHWRIT_VERSION=<contents of VERSION>
GIT_SHA=<commit being deployed>
SENTRY_ENVIRONMENT=production
```

Supply `SENTRY_AUTH_TOKEN` through the **environment of the Compose process**.
A value set only in the compose-root `.env` is not reliably forwarded to the
Bake secret provider across Compose versions. On a deployment platform, inject
it as a build secret/environment variable available to the Compose process.
For a local shell, read it from a restricted file outside the repository/build
context (provision that file through your secret manager):

```bash
export SENTRY_AUTH_TOKEN="$(cat /secure/path/sentry-token)"
docker compose build frontend
unset SENTRY_AUTH_TOKEN
```

The command text contains only the file path, so the token is not entered into
shell history. Do not use an inline token assignment or enable shell tracing
(`set -x`) while loading secrets. Compose forwards it to the BuildKit secret
mount; the token is not a build argument or a container runtime variable.

Plain `docker build`, from the repository root, can read the same file directly:

```bash
docker build -f frontend/Dockerfile \
  --secret id=SENTRY_AUTH_TOKEN,src=/secure/path/sentry-token \
  --build-arg SENTRY_UPLOAD_ENABLED=1 \
  --build-arg SENTRY_ORG=<org> --build-arg SENTRY_PROJECT=<project> \
  --build-arg NORTHWRIT_VERSION=$(cat VERSION) \
  --build-arg GIT_SHA=$(git rev-parse HEAD) \
  --build-arg NEXT_PUBLIC_SENTRY_DSN=... .
```

For `word-addin/Dockerfile`, use the add-in's project slug and also pass its
required `--build-arg REACT_APP_WEB_APP_URL=https://<web app host>` (and
`WORD_ADDIN_PUBLIC_URL` when configuring its manifest). Compose builds the web
app only; build the add-in image separately.

#### How CI publishes (and what a fork gets)

The active NorthWrit workflows validate applications and build images without pushing them. Publication requires a separately configured registry and release process. Imported workflows under `docs/upstream/original-source/.github/` remain historical references. Consult the [CI inventory](../07-implementation/NorthWrit-CI-Inventory.md) before enabling release automation.
