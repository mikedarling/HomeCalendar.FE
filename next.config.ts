import { url } from "inspector";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('https://api.calendar.emcoded.com/media/img/**')
    ]
  }
};

export default nextConfig;