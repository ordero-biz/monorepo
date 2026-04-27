import { baseTestConfig } from '@ordero/test-config';
import { configDefaults, mergeConfig } from 'vitest/config';

export default mergeConfig(baseTestConfig, {
  test: {
    exclude: [...configDefaults.exclude, 'e2e/**'],
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
