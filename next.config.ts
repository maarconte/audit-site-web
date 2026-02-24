import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  sassOptions: {
    silenceDeprecations: ["legacy-js-api", "import", "global-builtin", "if-function"],
  },
};

export default nextConfig;
