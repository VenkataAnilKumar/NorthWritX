# Phase 4 local Ollama workflow verification

Verified November 17, 2026 in the Toronto client timezone against f6936d0, included in merged PR 13.

Earlier probes posted to general chat at POST /chat. The normal matter UI uses POST /projects/:projectId/chat. A project_id on general chat did not supply the matter document context and project tools required by this scenario. Correcting the disposable harness to use matter chat resolved the demonstrated workflow failure. Application production code needed no change. Earlier probes do not establish that either model cannot answer matter questions.

The disposable stack processed a synthetic agreement with 30-day notice and a signed amendment replacing it with 47 calendar days. The owner asked matter chat to read both documents and identify the controlling period with a source citation. The standard built-in Ollama adapter used ollama/qwen2.5:3b.

All seven checks passed. The model returned the controlling period and a server-verified supporting quote tied to the exact amendment version. Its actual answer was saved through the work-product API with both source versions and hashes. DOCX ZIP/XML inspection verified the answer and source-version identifiers. Foreign users and revoked editors were denied matter-chat access, and an unauthorized actor could not export the draft. See the [safe outcome record](evidence/phase-4-ollama-correct-route.json) for duration, citation results and cleanup.

Ollama 0.40.16 ran on four CPUs without a GPU, using a 16,384-token context and one parallel request. Cloud features were disabled and the service bound to host loopback port 11435. The disposable host-run API set OLLAMA_BASE_URL=http://127.0.0.1:11435/v1 and STREAM_FIRST_CHUNK_TIMEOUT_MS=420000. This extended only the disposable API deadline. The cold prompt exceeds the default two-minute limit on this CPU. Dockerized APIs require an Ollama address reachable from their own network namespace.

Reproduce with the existing isolated source-journey Auth/PostgREST/storage/API fixtures. Discover the model through GET /models/ollama, create a matter chat, and submit inference through POST /projects/:projectId/chat. Use normal upload, work-product save and selected-version export routes. Check the final citations SSE snapshot for the exact version and server verification. The completed session runner is /workspace/.northwrit-ollama-trial.g0hLfJ/run-ollama-correct-route.cjs. Temporary fixture credentials and raw captures stay outside Git.

Only run-owned stack resources and private temporary fixtures were removed. Existing preview services were preserved. The local model cache and loopback Ollama container remain available. One synthetic example establishes this tested flow. Broader legal quality, browser citation navigation, Office-host acceptance and named review remain open.


## Browser follow-up and repeatability

The opt-in matter-ai-acceptance browser spec passed against real disposable Auth/API/database/storage services. It signed in, displayed the recorded AI answer and citation controls, opened Trial-Amendment.docx and checked its current version, loaded the saved draft and compared the body with the recorded answer, then downloaded DOCX and checked its XML for the notice period and source-version identifier. No browser API responses were mocked. See [browser fixture evidence](evidence/phase-4-ai-browser-replay.json).

This browser run reused the earlier server-verified model answer and citation snapshot. Document/version identifiers were rebound to freshly uploaded matching synthetic documents, and a persisted assistant message was seeded through the disposable service-role fixture. It establishes persisted-output browser behavior. The previously recorded live inference remains the evidence for model generation and server quote verification.

Fresh live repetitions exposed variability. One produced the correct period but printed citation JSON outside the supported CITATIONS block, resulting in zero citations. A more explicit formatting prompt succeeded in another run, but a later repeat again failed the verified-citation assertion. The [recorded failed repeat](evidence/phase-4-ai-live-repeat-failure.json) remains part of the evidence. End-to-end citation reliability is open, even though the earlier live example and the isolated browser fixture passed.

Two harness issues were corrected during browser preparation. Chromium now gets a short private temporary directory, avoiding Linux Unix-socket path limits under deeply nested work directories. The browser-enabled disposable API must set FRONTEND_URL to its web origin, http://127.0.0.1:3018 for this session, so normal origin protection admits browser sign-in. The AI conversation route is warmed before navigation. The browser spec is excluded from normal account-backed runs and selected only through the isolated harness with ai enabled.

Browser TypeScript, harness syntax, repository, branding and whitespace checks passed. Existing preview services were preserved, and each isolated stack recorded cleanup of only its own resources. The session reproduction runner for the replay is /workspace/.northwrit-ollama-trial.g0hLfJ/run-ollama-browser-replay.cjs. Office-host and broader legal-quality acceptance remain open.
