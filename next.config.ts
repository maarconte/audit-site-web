import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  images: { unoptimized: true },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api", "import", "global-builtin", "if-function"],
  },
};

export default nextConfig;
