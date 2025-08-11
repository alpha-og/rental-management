import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

const eslintConfig = [
    ...compat.config({
        extends: ["next", "next/core-web-vitals", "next/typescript"],
        settings: {
            next: {
                rootDir: "apps/client",
            },
        },
    }),
];

export default eslintConfig;
