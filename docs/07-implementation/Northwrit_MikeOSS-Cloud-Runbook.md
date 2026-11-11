# Archived Mike OSS cloud startup notes

The standalone Codex Cloud test was removed from the roadmap. These notes preserve the setup reference.

Target source is `a5c147d6587ca465f301e8479f6c50fbc5731c45`. These commands are for a Linux test environment with a Docker daemon. They were checked against the pinned source and still need a cloud execution. Use synthetic inputs and a disposable test account.

## 1. Check the environment

```bash
docker version
docker compose version
docker system df
df -h .
free -h
```

Confirm the server responds to Docker commands and Compose is at least 2.24 for optional `env_file` entries. Check free space for infrastructure images, application builds, and volumes. Check memory during builds and document processing. Source documentation sets the parser data budget to 1 GiB by default. That figure is per process and does not size the complete stack. Verify allowed access to GitHub and the image registries. A source build also needs the registries used by the Dockerfiles and npm lockfiles.

## 2. Obtain the pinned source and configure

From a scratch directory in the test environment:

```bash
git init mike-upstream
cd mike-upstream
git fetch --depth=1 https://github.com/Open-Legal-Products/mike.git a5c147d6587ca465f301e8479f6c50fbc5731c45
git checkout --detach FETCH_HEAD
test "$(git rev-parse HEAD)" = a5c147d6587ca465f301e8479f6c50fbc5731c45
umask 077
cp -n .env.example .env
cp -n backend/.env.example backend/.env
```

Set `SENTRY_DISABLED=true` in root `.env` before building. The Compose build passes this value into the browser bundle. Set `GOTRUE_EXTERNAL_GOOGLE_ENABLED=false` for the email-only test and leave email confirmation enabled. In `backend/.env`, set separate random values for `DOWNLOAD_SIGNING_SECRET` and `USER_API_KEYS_ENCRYPTION_SECRET` using a secure editor or secret injection. Each can be generated with `openssl rand -hex 32`. Root `.env` takes precedence over backend values where both define a name.

Auth, project creation and upload can be checked before choosing a model. For AI checks, use an authorized supported provider or a tool-capable Ollama model that fits the environment. Configure only the selected provider using secret injection or the supported per-user settings. Record the model ID and route. Confirm that tools actually run if testing with Ollama, because Mike can retry without tools.

At startup `workflow-sync` fetches the separate `Open-Legal-Products/mike-workflows` catalogue, which defaults to `main`. Resolve and record an accessible commit and set `MIKE_WORKFLOWS_REF` in `backend/.env` for a repeatable test. If a catalogue dependency fails, check network, ref and validation logs before modifying source.

## 3. Start and inspect the stack

Use a distinct Compose project. Keep test ports private. The demo Compose file uses known local infrastructure credentials and binds some ports on all interfaces. In a shared environment, apply an environment-specific port override or firewall before startup and verify the bindings. Use an in-environment browser on loopback for the first pass.

```bash
docker compose -p mike-baseline config --quiet
docker compose -p mike-baseline config --services
GIT_SHA="$(git rev-parse HEAD)" docker compose -p mike-baseline up -d --build
docker compose -p mike-baseline ps --all
docker compose -p mike-baseline logs --tail=100 db-init createbucket workflow-sync backend frontend
curl -fsS http://localhost:3001/health
curl -fsS http://localhost:3000/api/health
```

The one-shot database, bucket and workflow setup jobs should exit successfully. Verify the frontend loads on `http://localhost:3000` and confirm sign-up through the local Mailpit inbox on `http://localhost:8025`.

Use prebuilt images only when both application images have revision labels matching the chosen commit and the frontend build is suitable for the telemetry setting. Inspect `org.opencontainers.image.revision` and record the registry digests. The default tag in Compose is a release identifier. Verify it before using `up -d --no-build`. Record the infrastructure image digests after startup as some tags can change.

## 4. Verify browser reachability

A successful curl inside the cloud host establishes service availability. Test independently from the intended browser. For a remote browser, use an authenticated forwarding or preview setup that supports all required routes. Keep the database, Redis, Mailpit and the RustFS console private. A shared/public deployment requires hardened credentials and a separate deployment configuration.

| Traffic | Local endpoint | Remote browser requirement |
|---|---|---|
| App and streaming API | `http://localhost:3000` and `/api` | Set `FRONTEND_URL` and `API_PUBLIC_URL` to reachable origins in root `.env`. Check API and streaming through the app origin. |
| Email confirmation | Supabase gateway on `localhost:54321` | Set `SUPABASE_PUBLIC_URL` to the reachable gateway origin. Verify redirect back to the app. Restrict allowed redirects for exposed environments. |
| Direct uploads | RustFS S3 endpoint on `localhost:9000` | Set `R2_PUBLIC_ENDPOINT_URL` to the reachable storage origin before signing. Preserve the signed host and path through the proxy and allow the app origin in bucket CORS. Test the actual browser PUT. |

If the preview only supports the app port, use a browser in the environment or configure a route for each remaining dependency. A sign-in or upload blocked by routing is a separate result from portal availability.

## 5. Record baseline results

Use a synthetic NDA in PDF and a synthetic services agreement in DOCX. Put an explicit 30-day notice clause in one and omit it in the other.

| Check | Pass evidence |
|---|---|
| Auth and projects | Confirm email, sign in, create a project, refresh and reopen it. |
| Upload and processing | Both documents finish processing. A deliberate invalid upload reports a file-specific error. |
| Assistant | Ask about notice. Record model, streamed response and a citation that opens the exact supporting passage. |
| Tabular review | Use a notice-period column. Verify the explicit value and missing result in their respective rows and open the available citation. |
| Drafting | Draft a short notice using the cited clause. Check names, dates and required assumptions. Test DOCX export if offered in the chosen flow. |
| Persistence and permissions | Restart services and reopen results. From a second unshared account, attempt a direct project and document link. Record authorization behaviour. |

Record commit, image digests, catalogue revision, model, resource usage, results and any blocked checks. Redact tokens, signed URLs and auth email links from evidence. Stop and remove test containers with `docker compose -p mike-baseline down` when finished. This preserves test volumes.

Pinned upstream references are `docs/local-development.md`, `docs/deployment.md`, `docs/safe-local-testing.md`, `docker-compose.yml` and `backend/.env.example` inside the Mike checkout.
