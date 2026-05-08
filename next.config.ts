import path from "path";
import type { NextConfig } from "next";

const rootDir = path.join(__dirname);
const apiServerOrigin = process.env.API_SERVER_URL || "http://127.0.0.1:5500";

const nextConfig: NextConfig = {
  outputFileTracingRoot: rootDir,
  turbopack: {
    root: rootDir,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiServerOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
