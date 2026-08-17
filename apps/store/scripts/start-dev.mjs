import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const backendUrls = {
  local: 'http://localhost:8080',
  remote: 'https://ordero-service-production.up.railway.app',
};

const target = process.argv[2];
const backendUrl = backendUrls[target];
const nextArguments = ['dev', ...process.argv.slice(3)];

if (!backendUrl) {
  console.error('Usage: node scripts/start-dev.mjs <local|remote>');
  process.exit(1);
}

console.log(`Starting the store client with backend: ${backendUrl}`);

const nextCliPath = require.resolve('next/dist/bin/next');
const child = spawn(process.execPath, [nextCliPath, ...nextArguments], {
  env: {
    ...process.env,
    BACKEND_API_URL: backendUrl,
  },
  stdio: 'inherit',
});

child.on('error', (error) => {
  console.error(`Could not start Next.js: ${error.message}`);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
