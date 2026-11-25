import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep browser tests separate from an already running development server.
  distDir: process.env.PLAYWRIGHT_TEST ? '.next/playwright' : '.next',
  transpilePackages: ['@ordero/ui'],
  typescript: {
    tsconfigPath: 'tsconfig.next.json',
  },
  turbopack: {
    root: path.join(__dirname, '../..'),
  },
};

export default nextConfig;
