import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["harmonics-paternity-blighted.ngrok-free.dev"],
  transpilePackages: ["shiki"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
