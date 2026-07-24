import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
    ],
  },
  cacheComponents: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "candlecowbar.com" }],
        destination: "https://www.candlecowbar.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
