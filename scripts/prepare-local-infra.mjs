import { chmodSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Cloud checkouts may use umask 077. These are public repository configuration,
// read by non-root container users. Never chmod .env files or credential paths.
for (const relative of ['../infra/docker/db-init/roles.sql', '../infra/docker/storage-cors.json', '../infra/supabase/gateway.conf']) {
  const file = fileURLToPath(new URL(relative, import.meta.url));
  chmodSync(file, statSync(file).mode | 0o444);
}
console.log('Public infrastructure bind files are readable; credential file modes are unchanged.');
