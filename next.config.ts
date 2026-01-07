import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Increase header size limits to prevent HTTP 431 errors
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Configure headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
