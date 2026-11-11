# syntax=docker/dockerfile:1
# docker build -f apps/worker/Dockerfile --build-context api-image=docker-image://northwrit-migration-api .
# Compose supplies the API build as api-image so both runtimes share one artifact.
FROM api-image
COPY apps/worker/run.mjs /repo/apps/worker/run.mjs
CMD ["node", "--enable-source-maps", "/repo/apps/worker/run.mjs"]
