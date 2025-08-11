import type { NextConfig } from "next";
// import path from "path";

const nextConfig: NextConfig = {
    // eslint-disable-next-line @typescript-eslint/require-await
    async rewrites() {
        return [
            {
                source: "/api/v1",
                destination: "/",
            },
        ];
    },
    // output: "standalone",
    // outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
