import { baseTestConfig } from '@ordero/test-config';
import { mergeConfig } from 'vitest/config';

export default mergeConfig(baseTestConfig, {
  test: {
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
