import path from 'node:path';
import type { NextConfig } from 'next';

const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  transpilePackages: ['@ordero/ui'],
  allowedDevOrigins,
  typescript: {
    tsconfigPath: 'tsconfig.next.json',
  },
  turbopack: {
    root: path.join(__dirname, '../..'),
  },
};

export default nextConfig;
