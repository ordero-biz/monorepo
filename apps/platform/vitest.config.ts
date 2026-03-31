import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { baseTestConfig } from '@ordero/test-config';
import { mergeConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(baseTestConfig, {
  test: {
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
});
