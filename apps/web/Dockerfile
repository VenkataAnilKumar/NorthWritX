# syntax=docker/dockerfile:1
# Build from the repository root: `docker build -f apps/web/Dockerfile .`
# (docker-compose.yml does the same). The image mirrors the repository layout
# under /repo: the frontend at /repo/apps/web plus the sibling directories
# production code reaches through tsconfig `paths` aliases, `@northwrit/contracts`
# -> /repo/packages/contracts, `@northwrit/ui` -> /repo/packages/ui and
# `@northwrit/client` -> /repo/packages/client. Nothing else. The layout matters:
# next.config.ts sets the Turbopack root to the repository root,
# which must contain the packages. `next build` type-checks
# tsconfig.build.json, which leaves test files -- and their imports of shared
# fixtures and add-in sources -- out of the image.
#
# A new outside source dependency needs a COPY here and a tsconfig alias that
# resolves to the same path; apps/web/src/__tests__/architecture.test.ts
# checks that the two agree, and .github/workflows/container-builds.yml builds
# this file in CI so a miss fails the pull request, not the next fresh install.
# Two stages so the publish workflow can rebuild `app` (where the Sentry
# source-map upload happens inside `next build`) without redoing `npm ci`:
# BuildKit would otherwise reuse the build layer from a token-less build and
# silently skip the upload, because secret contents are not part of the cache
# key (.github/workflows/publish-images.yml, no-cache-filters).
FROM node:22-slim AS deps

WORKDIR /repo
COPY package.json package-lock.json .npmrc ./
COPY --parents apps/api/package.json apps/web/package.json apps/word-addin/package.json apps/desktop/package.json apps/worker/package.json packages/contracts/package.json packages/client/package.json packages/ui/package.json tests/browser/package.json ./
RUN --mount=type=secret,id=proxy_ca \
    if [ -f /run/secrets/proxy_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca; fi; \
    npm ci --workspace apps/web --include-workspace-root=false

WORKDIR /repo/apps/web

FROM deps AS app
COPY apps/web/ ./
COPY packages/contracts /repo/packages/contracts
COPY packages/ui /repo/packages/ui
COPY packages/client /repo/packages/client

# Baked Sentry defaults for the Next server and browser tunnel (optional).
# Non-empty runtime SENTRY_* values override them. See docs/observability.md.
ARG FRONTEND_URL=http://localhost:3000
ARG NEXT_PUBLIC_NORTHWRIT_SUPPORT_EMAIL=
ARG NEXT_PUBLIC_SENTRY_DSN=
ARG NEXT_PUBLIC_SENTRY_DISABLED=
ARG NEXT_PUBLIC_SENTRY_INSTALL=
ARG NEXT_PUBLIC_SENTRY_ENVIRONMENT=
ARG NEXT_PUBLIC_SENTRY_RELEASE=
# Release identity: the product version (VERSION, or VERSION-dev.<run> for a
# main build) and the commit, both from the publish workflow. Together they
# make the release `mike@<version>+<sha12>` for the browser bundle (inlined)
# and the Next server; a local build without them is `mike@0.0.0...`.
ARG MIKE_VERSION=
ARG GIT_SHA=
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN \
    NEXT_PUBLIC_SENTRY_DISABLED=$NEXT_PUBLIC_SENTRY_DISABLED \
    NEXT_PUBLIC_SENTRY_INSTALL=$NEXT_PUBLIC_SENTRY_INSTALL \
    NEXT_PUBLIC_SENTRY_ENVIRONMENT=$NEXT_PUBLIC_SENTRY_ENVIRONMENT \
    NEXT_PUBLIC_SENTRY_RELEASE=$NEXT_PUBLIC_SENTRY_RELEASE \
    NEXT_PUBLIC_MIKE_VERSION=$MIKE_VERSION \
    NEXT_PUBLIC_GIT_SHA=$GIT_SHA \
    MIKE_VERSION=$MIKE_VERSION \
    GIT_SHA=$GIT_SHA

# Sentry source-map upload (docs/observability.md). Needs all three; the token
# is a build secret so it never lands in an image layer.
ARG SENTRY_ORG=
ARG SENTRY_PROJECT=
# A non-secret switch participates in the cache key: enabling uploads must
# rebuild a previously tokenless bundle. Token rotation/re-upload also needs
# --no-cache because BuildKit deliberately excludes secret contents.
ARG SENTRY_UPLOAD_ENABLED=0
RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN,env=SENTRY_AUTH_TOKEN \
    case "$SENTRY_UPLOAD_ENABLED" in \
      0) unset SENTRY_AUTH_TOKEN ;; \
      1) if [ -z "$SENTRY_AUTH_TOKEN" ] || [ -z "$SENTRY_ORG" ] || [ -z "$SENTRY_PROJECT" ]; then \
           echo "Sentry upload requires the token build secret, SENTRY_ORG and SENTRY_PROJECT" >&2; exit 1; \
         fi ;; \
      *) echo "SENTRY_UPLOAD_ENABLED must be 0 or 1" >&2; exit 1 ;; \
    esac; \
    npm run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
