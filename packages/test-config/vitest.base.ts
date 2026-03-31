import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export const baseTestConfig = defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
