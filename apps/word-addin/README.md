# NorthWrit Word Add-in

The NorthWrit Word add-in brings document-aware chat, workflows, quick actions, and
tracked-edit review into a Word task pane.

It uses the same backend-managed HttpOnly cookie session, NorthWrit API, model
providers, and workflow library as the web app. Word conversations are stored
separately from the web assistant's chat history. Word currently uses the
Personal workspace for models, memory, workflows, quick actions and document
pickers. Organization documents and workflow assets cannot be attached to Word
chats. Older chats with organization attachments must be replaced with a new
Personal chat before continuing; they are also excluded from new Personal
memory learning. This does not purge previously stored chats or memory.

## Prerequisites

- Node.js 22 or newer
- Microsoft Word desktop or Word on the web
- A running NorthWrit backend and Supabase environment configured according to the
  [local development guide](../../docs/engineering/local-development.md)
- A NorthWrit account
- A model-provider API key or an Ollama model reachable by the backend

## Quick start

Install from the repository root using the shared lockfile:

```bash
npm run setup:word
```

For a fresh checkout, copy `apps/word-addin/.env.example` to `apps/word-addin/.env`; preserve existing settings when updating. Configure the API/web origins and follow the [HTTPS and sideloading guide](../../docs/engineering/word-addin-development.md). With the configured backend running, start webpack from the repository root:

```bash
npm run dev:word
```

This starts development serving without automatic sideloading. To explicitly start the Office sideload flow, use `npm --workspace apps/word-addin start`. Certificate trust and Office installation are platform requirements; the first trust operation may request operating-system approval. The `WORD_ADDIN_SIDELOAD` switch applies to the start helper, not plain `dev:word`.

The optional `apps/word-addin/scripts/dev.sh` bootstrap helper writes `.env` and runs `npm install`; review its behaviour before using it on an existing checkout. The frozen root install and explicit development commands above are the documented default.

## What it supports

- Chat about the open Word document with streamed responses
- Attach NorthWrit library documents and assistant workflows
- Choose from the same supported model providers as the web app
- Apply suggested revisions as tracked changes, then accept or reject them
- Run configurable quick actions such as Proofread and Compare documents
- Create and edit assistant workflows
- Store chat history in NorthWrit Cloud or on the current device only

The add-in requires `WordApi 1.6` for tracked-change review.

## Commands

After installing from the repository root, run the following commands from `apps/word-addin/`, or select that workspace explicitly from the root.

| Command                    | Purpose                                                             |
| -------------------------- | ------------------------------------------------------------------- |
| `npm run dev`  | Start webpack in the foreground without sideloading Word            |
| `npm start`                | Start the HTTPS dev server; sideload unless `WORD_ADDIN_SIDELOAD=0` |
| `npm run stop`             | Stop the sideloaded development session                             |
| `npm run dev:server`       | Internal alias for starting webpack without launching Word          |
| `npm run typecheck`        | Check application and E2E TypeScript                                |
| `npm run build:e2e`        | Build with the hermetic test environment                            |
| `npm run test:e2e`         | Run the mocked Office.js Playwright suite                           |
| `npm run build`            | Create a production bundle and rewritten manifest                   |
| `npm run start:production` | Serve `dist/` and proxy `/api` using `WORD_ADDIN_BACKEND_ORIGIN`    |

## Manual sideloading

The quick-start script is the recommended development path. If automatic
sideloading fails:

- **Word desktop on macOS:** copy `manifest.xml` into
  `~/Library/Containers/com.microsoft.Word/Data/Documents/wef/`, restart Word,
  then open **Insert → Add-ins → My Add-ins → NorthWrit**.
- **Word on the web:** open **Insert → Add-ins → Upload My Add-in** and select
  `manifest.xml`. Browser local-network protections can block localhost panes;
  use the included `e2e-live/manual-session.mjs` launcher when needed.

## Development reference

See [Word add-in development and deployment](../../docs/engineering/word-addin-development.md)
for:

- manual environment and HTTPS setup;
- desktop and web sideloading;
- production builds and CORS configuration;
- cloud and device-only chat-storage behavior;
- automated and keyless testing; and
- certificate, login, upload, workflow, and tracked-edit troubleshooting.
