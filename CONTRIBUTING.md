# Contributing to NorthWrit

Keep changes focused and explain the problem, resulting behaviour, and verification in the pull request. Discuss changes to the data model, public API, or multiple subsystems before implementation.

Read [repository instructions](AGENTS.md), [application instructions](apps/AGENTS.md), and the [developer guide](docs/guides/developer.md). Follow the current [implementation plan](docs/07-implementation/NorthWrit-Implementation-Plan.md) and preserve existing user changes.

## Application changes

- Keep domain logic in its existing module and use service facades and shared access helpers.
- Preserve authorization across APIs, jobs, downloads, and exports.
- Check existing web primitives and `packages/ui/` before creating new components. Follow the [design system](docs/engineering/design-system.md).
- Update documentation and environment examples when setup or behaviour changes.
- Keep credentials, local environment files, browser authentication state, and private documents out of commits.
- Preserve third-party license and copyright notices. See [Credit.md](Credit.md) and [source provenance](docs/06-technical/NorthWrit-Source-Provenance.md).

## Testing

Use Node.js 22 or later. Install from the root with `npm ci`; the root lockfile is authoritative. Run the checks appropriate to the change:

```bash
npm run check:repo
npm run check:whitespace
npm run test:api
npm run test:web
npm run test:word
npm run typecheck
npm run lint
```

Build affected applications as required by the application instructions. Dockerfile, build-context, tsconfig, and cross-application import changes also require affected container builds. The [CI inventory](docs/07-implementation/NorthWrit-CI-Inventory.md) describes the active gates.

Browser and database suites require their documented isolated services and synthetic data. Read [safe local testing](docs/engineering/safe-local-testing.md) before running them. Do not restart the archived standalone cloud baseline test or run cleanup sweeps as an incidental check.

## NorthWrit workflows

The API owns workflow ingestion and catalog behaviour in `apps/api/src/lib/workflowCatalogSource.ts` and the workflows domain module. Configure the workflow source explicitly for the deployment. Workflow instructions use `SKILL.md`; tabular workflows use `table-columns.yaml`, and packs use `pack.yaml`.

Run ingestion after database migrations and before starting a deployment that needs the catalog:

```bash
npm run build:api
npm --workspace apps/api run sync:workflows
```

Ingestion validates the source and reference assets before replacing the active catalog. Review catalog and permission tests when changing this behaviour.

## Pull requests and security

Describe the change and its purpose, list verification results and limitations, and review the diff before submitting. The active workflows are under root `.github/workflows/`.

Report vulnerabilities privately using the [security policy](SECURITY.md).
