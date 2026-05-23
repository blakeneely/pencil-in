import eslintReact from '@eslint-react/eslint-plugin'
import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import checkFile from 'eslint-plugin-check-file'
import importX from 'eslint-plugin-import-x'
import reactHooks from 'eslint-plugin-react-hooks'
import reactPerf from 'eslint-plugin-react-perf'
import reactRefresh from 'eslint-plugin-react-refresh'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier/flat'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),

  // Source files: full ruleset with type-aware linting
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      eslintReact.configs['recommended-type-checked'],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      'import-x': importX,
      'unused-imports': unusedImports,
      'check-file': checkFile,
      'react-perf': reactPerf,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'no-prototype-builtins': 'off',
      'no-console': ['error', { allow: ['info', 'error'] }],
      'no-unused-vars': 'off',

      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      'react-perf/jsx-no-new-object-as-prop': 'error',
      'react-perf/jsx-no-new-array-as-prop': 'error',
      'react-perf/jsx-no-new-function-as-prop': 'error',
      'react-perf/jsx-no-jsx-as-prop': 'error',

      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'import-x/first': 'error',
      'import-x/export': 'error',
      // ESLint 10 removed FileEnumerator API that this rule depends on; the
      // import-x team is working on an alternative. Suppression keeps the rule
      // intent declared while silencing the noop warning.
      'import-x/no-unused-modules': [
        'error',
        {
          unusedExports: true,
          suppressMissingFileEnumeratorAPIWarning: true
        }
      ],
      'import-x/no-duplicates': ['error', { considerQueryString: true }],
      'import-x/no-useless-path-segments': ['error', { noUselessIndex: true }],
      'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import-x/named': 'off',
      'import-x/no-unresolved': 'off',
      'import-x/no-named-as-default': 'off',
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['sibling', 'parent'],
            'index',
            'unknown',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],

      'check-file/filename-blocklist': [
        'error',
        {
          '**/*.js': '*.ts',
          '**/*.model.ts': '*.models.ts',
          '**/*.util.ts': '*.utils.ts',
        },
      ],
      'check-file/folder-match-with-fex': [
        'error',
        {
          '*.test.{ts,tsx}': '**/__tests__/',
        },
      ],
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{ts,tsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/!(@types)': 'KEBAB_CASE',
        },
      ],
    },
  },

  // Config files at the repo root: relax the rules that don't fit them
  {
    files: ['*.config.{js,ts}', 'eslint.config.js'],
    rules: {
      'check-file/filename-blocklist': 'off',
      'check-file/filename-naming-convention': 'off',
    },
  },

  // Prettier compatibility — must come last to disable conflicting style rules
  prettier,
])
