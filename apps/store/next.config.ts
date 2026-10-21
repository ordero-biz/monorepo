import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep browser tests separate from an already running development server.
  distDir: process.env.PLAYWRIGHT_TEST ? '.next/playwright' : '.next',
  async redirects() {
    return [
      {
        source: '/products/warehouse/:path*',
        destination: '/warehouse/:path*',
        permanent: true,
      },
      {
        source: '/products/supplies/:path*',
        destination: '/warehouse/supplies/:path*',
        permanent: true,
      },
      {
        source: '/products/suppliers/:path*',
        destination: '/warehouse/suppliers/:path*',
        permanent: true,
      },
    ];
  },
  transpilePackages: ['@ordero/ui'],
  typescript: {
    tsconfigPath: 'tsconfig.next.json',
  },
  turbopack: {
    root: path.join(__dirname, '../..'),
  },
};

export default nextConfig;
