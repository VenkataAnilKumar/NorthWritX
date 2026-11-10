# NorthWrit local smoke test

Run these commands in PowerShell from the NorthWritX workspace after Docker Desktop reports that its Linux engine is running.

```powershell
$compose = "$env:ProgramFiles\Docker\Docker\resources\cli-plugins\docker-compose.exe"
$stack = @('-p', 'northwrit-smoke', '-f', 'NorthWrit/deployment/docker_compose/docker-compose.yml', '-f', 'scripts/northwrit-smoke.compose.yml')
& $compose @stack up -d --build --wait
& $compose @stack ps
```

The build uses the local source tree. The override binds the web port to loopback on port 3000.

1. Open http://localhost:3000. Create a local test account and verify that you can sign out and back in.
2. Create a text file named `pilot-smoke.txt` containing the synthetic sentence below. Upload it and wait for indexing to complete.
3. Connect an approved model for the test. Ask “What is the Meridian pilot review code? Cite the source.” The answer should be `MAPLE-742`. Open the citation and confirm it points to the sample file.
4. Reload the page and confirm the thread and citation still open.

> The fictional Meridian pilot review code is MAPLE-742. It is a test value with no client data.

To stop the smoke stack while retaining its data, run `& $compose @stack down`.
