# NorthWrit security policy

## Reporting a vulnerability

Report security-sensitive findings privately to the NorthWrit repository maintainers. If GitHub's **Security → Report a vulnerability** option is enabled on this repository, use it. Otherwise, arrange a private reporting channel with a maintainer before sharing exploit details or sensitive data. Do not post credentials or private documents in public issues.

Include the affected commit, deployment type, a concise description, impact, and reproduction steps using synthetic data. Redact tokens, personal information, and client content.

## Scope

Reports may cover application code, default configuration, authentication, authorization, document access, data isolation, model/tool boundaries, and deployment guidance. Prompt injection and unintended disclosure through model output are in scope.

Test only systems you own or are authorized to assess. Use disposable accounts and synthetic documents; avoid destructive tests or access to other users' data. Installation-specific infrastructure issues should also be reported to that installation's operator.

## Maintenance and dependency fixes

Record the affected version or commit. This policy does not establish a hosted service, response-time commitment, or a separately supported release branch.

Review dependency advisories against the versions and deployment in use. Update manifests, root overrides, and the root lockfile together where required, and verify affected behaviour. Repository administrators manage dependency alerts and update settings; a policy document alone does not enable those services.

Follow the [contribution guide](CONTRIBUTING.md), [safe testing guide](docs/engineering/safe-local-testing.md), and [CI inventory](docs/07-implementation/NorthWrit-CI-Inventory.md) for change verification.
