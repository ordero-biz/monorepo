import path from 'node:path';
import {fileURLToPath} from 'node:url';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';

const dirname =
    typeof __dirname !== 'undefined'
        ? __dirname
        : path.dirname(fileURLToPath(import.meta.url));

export const baseTestConfig = defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: [
      {
        find: /^@ordero\/ui\/components\/(.+)$/,
        replacement: path.resolve(dirname, '../ui/src/components/$1'),
      },
      {
        find: /^@ordero\/ui\/hooks\/(.+)$/,
        replacement: path.resolve(dirname, '../ui/src/hooks/$1'),
      },
      {
        find: /^@ordero\/ui\/lib\/(.+)$/,
        replacement: path.resolve(dirname, '../ui/src/lib/$1'),
      },
      {
        find: /^@ordero\/ui\/(.+)$/,
        replacement: path.resolve(dirname, '../ui/src/$1'),
      },
      {
        find: '@/ui',
        replacement: path.resolve(dirname, '../ui/src'),
      },
    ],
  },
});
