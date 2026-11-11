# NorthWritX repository instructions

Application surfaces live under `apps/`, shared code under `packages/`, and infrastructure under `infra/`. Read `apps/AGENTS.md` and any applicable child instructions before changing application code. Those instructions cover backend modules, frontend primitives, migrations, tests and upstream compatibility. Root instructions apply to repository entry points, documentation and CI as well.

## Scope and ownership

- Read `README.md`, `docs/06-technical/NorthWrit-Repository-Ownership.md` and the current implementation plan before changing layout or build commands.
- Follow ADR 0002 for the expanded layout and ADR 0003 for the npm root workspace. Preserve package boundaries; root `package-lock.json` is authoritative. Use root `npm ci` or `npm ci --workspace <path>`; do not create child lockfiles. `apps/worker` invokes the API-owned worker entry point; do not copy domain services into it.
- Keep application logic in existing domain modules and shared packages. Use service facades and shared access helpers; authorization must hold in APIs, jobs, downloads and exports.
- Preserve source notices, migration history, `@northwrit/*` package names and compatibility-sensitive URLs/identifiers unless a documented, verified change requires otherwise.
- Each cloud task is already isolated. Use the existing checkout; create a Git worktree only when explicitly requested.
- Preserve existing user changes. Do not move files or remove resources belonging to another task.

## Documentation

Root `docs/` owns NorthWrit requirements, architecture decisions, the roadmap and verification records. `docs/engineering/` owns application engineering and operating procedures. Describe proposals and unverified capabilities explicitly. Historical blueprints do not override the current plan or working source.

Record structural decisions under `docs/decisions/`. Update command instructions, active CI paths and provenance mappings together when layout changes are approved. The root `.github/workflows/` directory is the active workflow location; imported nested workflows are references until explicitly adapted.

## Verification and safety

Use Node.js 22 or later. Run `npm run check:repo` and `npm run check:whitespace` for repository changes. Run affected package tests, type checks, lint and builds as required by the application instructions. Preserve the underlying command's nonzero exit status; do not use `--if-present` to hide missing checks.

Do not restart the archived standalone cloud baseline test. Stack and browser tests need their own documented, isolated configuration and synthetic data. Never run cleanup sweeps, remove volumes, or alter unrelated services as an incidental verification step.

Keep signing secrets, provider keys, local environment files and browser authentication state out of Git and logs. Read credential names/presence, not values, when diagnosing configuration. Do not publish, deploy or claim external preview access merely because an internal request passed.
