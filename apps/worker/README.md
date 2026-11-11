# NorthWrit worker process

This package owns the standalone process boundary. `apps/api` owns domain
services, queue handlers, authorization, dependencies, configuration, and the
compiled `dist/worker.js` entry point. No API source is copied into this package.

From the repository root:

```bash
npm run setup:api
npm run build:worker
npm run start:worker
# Or execute TypeScript through the API's pinned tsx loader:
npm run dev:worker
```

The launcher activates `apps/api` as its working directory so its `.env` and
relative resources resolve consistently. Runtime environment bindings override
local values. Set `WORKERS_MODE=none` on the API when this standalone process owns
background processing. SIGINT/SIGTERM use the existing worker shutdown logic.

`npm --prefix apps/worker test` checks source and compiled startup, lifecycle
probing, polling and graceful termination using an isolated loopback stub. It
requires installed API dependencies and a completed API build; it is not a real
database acceptance test. API queue, job and access suites cover job semantics.
For containers, `apps/worker/Dockerfile` derives from the API build target and
uses the same dependencies and services.
