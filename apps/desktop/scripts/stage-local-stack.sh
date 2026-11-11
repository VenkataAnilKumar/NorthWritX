#!/usr/bin/env bash
# Stage the built product into local-stack/app/ for packaging. After this,
# `npm run dist:local` produces a Mike.app that carries the whole stack
# (config.js resolves these paths under process.resourcesPath when packaged).
#
# Prereqs: scripts/fetch-local-stack.sh (binaries) and
# scripts/build-local-stack.sh (backend dist + frontend standalone) have run.
set -euo pipefail
cd "$(dirname "$0")/../../.."

test -x apps/desktop/local-stack/bin/pg/bin/postgres || { echo "run local:fetch first"; exit 1; }
test -f apps/api/dist/index.js || { echo "run local:build first"; exit 1; }
test -f apps/api/dist/workflow-catalog/catalog.json || { echo "run local:build to bundle offline workflows"; exit 1; }
test -f apps/web/.next/standalone/apps/web/server.js || { echo "run local:build first"; exit 1; }

APP="apps/desktop/local-stack/app"
rm -rf "$APP"
mkdir -p "$APP/backend" "$APP/frontend"
node apps/desktop/scripts/stage-source-notices.mjs "$APP" apps/desktop/local-stack/bin/notices

echo "==> backend (dist + prod deps + schema/migrations)"
cp -R apps/api/dist "$APP/backend/dist"
cp apps/api/package.json apps/api/package-lock.json apps/api/schema.sql "$APP/backend/"
cp -R apps/api/migrations "$APP/backend/migrations"
(cd "$APP/backend" && npm ci --omit=dev --no-audit --no-fund >/dev/null)

# The standalone output is traced from the repository root, so it holds
# apps/web/server.js next to the node_modules it needs (see
# apps/desktop/src/local/config.js).
echo "==> frontend (standalone server)"
cp -R apps/web/.next/standalone/. "$APP/frontend/"

echo "==> staged into $APP"
