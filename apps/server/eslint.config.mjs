// @ts-check
import tseslint from 'typescript-eslint';
import eslintNestJs from '@darraghor/eslint-plugin-nestjs-typed';

export default tseslint.config(
    {
        files: ['**/*.ts', '**/*.cts', '**/*.mts'],
    },
    eslintNestJs.configs.flatRecommended, // This is the recommended ruleset for this plugin
);
