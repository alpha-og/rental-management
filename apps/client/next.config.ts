import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Remove the rewrite that was interfering with backend API calls
    // eslint-disable-next-line @typescript-eslint/require-await
    async rewrites() {
        return [];
    },
    // output: "standalone",
    // outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
