import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'on-failure' }]],
  use: {
    baseURL: 'http://127.0.0.1:3001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'node e2e/support/backend.mts',
      url: 'http://127.0.0.1:3101/health',
      reuseExistingServer: false,
    },
    {
      command: 'pnpm exec next dev --hostname 127.0.0.1 --port 3001',
      url: 'http://127.0.0.1:3001',
      // Always start with the isolated test backend, never a developer's server.
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        BACKEND_API_URL: 'http://127.0.0.1:3101',
        PLAYWRIGHT_TEST: '1',
      },
    },
  ],
});
