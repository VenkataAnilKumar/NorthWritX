#!/usr/bin/env bash
# Build the product halves the local stack runs:
#   backend  → apps/api/dist          (tsc; runs under Electron's Node)
#   frontend → apps/web/.next/standalone  (Next standalone server with the
#              same-origin API gateway configured by the local supervisor)
#
# Dev-mode local runs use these outputs in place; packaging stages them into
# local-stack/app/ (see stage-local-stack.sh).
set -euo pipefail
cd "$(dirname "$0")/../../.."

echo "==> backend (tsc)"
(cd apps/api && npx tsc)

echo "==> bundled workflow catalog (downloaded at build, installed offline)"
node apps/desktop/scripts/bundle-workflows.js

echo "==> frontend (next build, standalone, local reporting disabled)"
(cd apps/web && rm -rf .next && \
  env -i PATH="$PATH" HOME="$HOME" TMPDIR="${TMPDIR:-/tmp}" \
  NEXT_OUTPUT_STANDALONE=1 \
  SENTRY_DISABLED=true NEXT_PUBLIC_SENTRY_DISABLED=true \
  SENTRY_AUTH_TOKEN= SENTRY_ORG= SENTRY_PROJECT= \
  NEXT_TELEMETRY_DISABLED=1 \
  NODE_OPTIONS=--max-old-space-size=3072 \
  npm run build -- --webpack)

# Standalone output does not include static assets or public/ — the server
# expects them beside it (Next's documented deployment step). The output is
# traced from the repository root, so the server and its .next/ live under
# standalone/apps/web/.
STANDALONE_APP=apps/web/.next/standalone/apps/web
echo "==> staging static assets into the standalone server"
rm -rf "$STANDALONE_APP/.next/static" "$STANDALONE_APP/public"
cp -R apps/web/.next/static "$STANDALONE_APP/.next/static"
[ -d apps/web/public ] && cp -R apps/web/public "$STANDALONE_APP/public"
# Next may trace a developer's local env file into standalone output. The
# downloaded app receives its complete configuration from the supervisor.
for file in "$STANDALONE_APP"/.env "$STANDALONE_APP"/.env.*; do
  [ ! -f "$file" ] || rm "$file"
done

echo "==> done"
