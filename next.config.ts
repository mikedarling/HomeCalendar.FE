import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('https://api.calendar.emcoded.com/media/img/**')
    ],
    minimumCacheTTL: 1209600, // (60s * 60m * 24h * 14d)
  }
};

export default nextConfig;