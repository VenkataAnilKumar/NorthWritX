# NorthWrit supplier-review demo

Captured November 16, 2026 from the local NorthWrit application at source baseline `4de6899`. The API was built from this checkout and the preview served the existing web build; this was not a fresh release build. This walkthrough uses a synthetic account and fictional documents. No real client data, provider credentials or generated AI findings appear in the assets.

## What this demo verifies

| Step | Result | Image |
|---|---|---|
| Create a project | The synthetic project was created through the authenticated application API and opened in the web UI | [Project](../assets/demo/01-project.png) |
| Upload two source PDFs | Signed transfers completed; both files were processed and appeared in the project | [Project documents](../assets/demo/01-project.png) |
| Preview and version a source | The PDF rendered in the document viewer; a second source version was uploaded and both versions were visible | [Document and versions](../assets/demo/02-document.png) |
| Download the revised source | Version 2 was downloaded; its SHA-256 matched the uploaded revision bytes | [Document versions](../assets/demo/02-document.png) |
| Save reusable instructions | A manually authored Assistant workflow was persisted and opened in its editor | [Assistant workflow](../assets/demo/03-workflow.png) |
| Define tabular extraction | A tabular workflow with four questions was persisted and opened in its editor | [Review setup](../assets/demo/04-review-setup.png) |
| Browse saved workflows | Both workflows appeared in the account's workflow library | [Workflow library](../assets/demo/05-workflow-library.png) |
| Open the desktop client | The actual Electron client authenticated and displayed the same project and source documents | [Desktop](../assets/demo/06-desktop.png) |

Screens are unmodified captures of the running application, not product mockups. Web captures use a 1600 × 1000 viewport; the desktop capture uses its actual client viewport. Different captures show successive steps, so the project overview precedes the second-version upload. All six PNGs together are under 1 MB.

AI chat, workflow execution, generated review cells, legal research and suggested edits were not run. A working model is required for those actions. Saving a workflow verifies configuration and persistence, not model output quality. The desktop capture is a Linux Electron preview, not signed macOS release validation.

## Sample documents

- [Supplier Services Agreement — Version 1](../assets/demo/samples/Supplier-Services-Agreement.pdf): fictional parties, services, fees, confidentiality, liability and renewal terms.
- [Customer Review Instructions](../assets/demo/samples/Customer-Review-Instructions.pdf): a manually authored review objective, questions and source-reference instructions.
- [Supplier Services Agreement — Version 2](../assets/demo/samples/Supplier-Services-Agreement-v2.pdf): a manually authored revision with acceptance criteria, an explicit liability cap and changed renewal notice.

The PDF fixtures are stored as binary files in Git to preserve their byte offsets and contents.

These are demonstration fixtures, not recommended contract wording or legal advice. The first agreement and instructions belong to one project; upload Version 2 to the existing agreement using **Upload new version**, rather than creating a separate project document.

## Replay the document journey

1. Follow [local setup](../engineering/local-development.md) and configure the API/web origins, database, authentication, storage and processing workers. Preserve existing environment files and data.
2. Register a disposable local account, confirm its email through Mailpit, and complete onboarding. Keep confirmation enabled. Model setup can be completed later.
3. Create **Maple Harbour — Supplier Review**, with reference **DEMO-002**. Upload the agreement and instructions into that project.
4. Wait for processing to complete, then open the agreement. Confirm its text and metadata render.
5. Use **Upload new version** for the revised agreement. Check that Version 1 and Version 2 are accessible in the version panel.
6. Open the same project in the desktop client connected to this application. Desktop sign-in uses its own cookie session.

The first local preview used PostgreSQL 17 Alpine with the required auth roles/search path, Supabase Auth/PostgREST, RustFS, Mailpit and Redis because the full database image exceeded available disk space. This is a session-specific preview configuration; the application's documented Compose configuration remains the normal setup reference. Its initial auth/application migration ledgers were reconciled within the fresh preview database; no existing user database or application migration file was changed. This demo is not the archived standalone cloud baseline test.

## Prepare the Assistant workflow

Create an Assistant workflow called **Supplier agreement checklist**, then save these manually authored instructions:

```markdown
# Supplier agreement checklist

## Purpose
Prepare a first-pass checklist from the supplied agreement and customer instructions.

## Steps
1. Identify the parties, services, term and fees.
2. Extract confidentiality, liability, termination and renewal terms.
3. Cite the relevant section and source wording for each observation.
4. Separate explicit terms, assumptions and questions for the lawyer.
5. End with a concise list of issues requiring human review.

## Boundaries
Use only the supplied documents. Do not invent missing terms or legal authorities.
Flag unknowns. This manually authored workflow requires a configured model to execute.
```

The saved instructions describe intended model behaviour; compliance was not evaluated in this capture pass. Configure a model, select authorized documents, and inspect every answer against the source before treating a future run as an accepted review.

## Prepare the tabular workflow

Create a tabular workflow called **Contract terms extraction** with these columns:

| Column | Prompt |
|---|---|
| Parties | Identify each party and its role. Cite the source section. |
| Fees & term | Extract fees, payment period and initial term. Quote the source. |
| Liability | Extract the cap and exclusions. Do not infer missing carve-outs. |
| Renewal & exit | Extract renewal notice, termination rights and cure periods. |

The screenshot shows these saved questions, not extracted answers. Running them requires a configured model and the corresponding document selection. Keep model-generated findings distinct from the uploaded source and from lawyer approval.

## Capture and publication rules

Use a dedicated synthetic account and fictional source files. Capture the running UI after loading completes, with no transient warnings or failed requests. Keep passwords, auth cookies, signed URLs and private configuration out of screenshots and repository files. Caption setup, live execution and reviewed results according to what actually occurred.

Refresh screenshots when the UI changes. Keep the [README](../../README.md), this walkthrough and [product catalogue](../02-product/NorthWrit-Product-Catalogue.md) consistent. Images are collected for repository review; this work did not publish a site, deploy a service or distribute a desktop release.
