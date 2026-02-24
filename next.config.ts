import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    silenceDeprecations: ["legacy-js-api", "import", "global-builtin", "if-function"],
  },
};

export default nextConfig;
