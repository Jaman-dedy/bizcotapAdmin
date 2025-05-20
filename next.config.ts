import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['antd'],
  eslint: {
    // Disable ESLint during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checks during build
    ignoreBuildErrors: true,
  },
  // Skip prerendering for problematic routes
  experimental: {
    workerThreads: false,
    cpus: 1
  },
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
