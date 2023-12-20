module.exports = {
  env: {
    browser: true,
    es2022: true,
  },
  plugins: ['react', 'react-hooks', 'import', '@typescript-eslint', 'prettier', 'unused-imports'],
  extends: [
    'airbnb',
    'airbnb/hooks',
    'eslint:recommended',
    'plugin:react/recommended',
    "plugin:import/recommended",
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    quotes: ['error', 'single'],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
		"no-unused-vars": "off",
    "no-use-before-define": ["error", { "functions": false }],
    "unused-imports/no-unused-imports": "error",
    'no-duplicate-imports': 'error',
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-unused-vars': 'error',
    'no-multiple-empty-lines': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['warn', {
      extensions: ['.tsx', '.ts'],
    },],
    'react/function-component-definition': ['error', {
      namedComponents: 'function-declaration',
    }],
    'import/extensions': ['error', 'ignorePackages', {
      ts: 'never',
      tsx: 'never',
    }],
    "import/order": ["error", {
      "newlines-between": "always",
      groups: [
        "external",
        "internal",
        "type",
      ],
      pathGroups: [
        { pattern: "react*", group: "external", position: "before" },
        { pattern: "@app", group: "internal", position: "after" },
        { pattern: "@components", group: "internal", position: "after" },
        { pattern: "@contexts", group: "internal", position: "after" },
        { pattern: "@hooks", group: "internal", position: "after" },
        { pattern: "@interfaces", group: "internal", position: "after" },
        { pattern: "@pages", group: "internal", position: "after" },
        { pattern: "@router", group: "internal", position: "after" },
        { pattern: "@ui", group: "internal", position: "after" },
        { pattern: "@utils", group: "internal", position: "after" },
        { pattern: "@styles", group: "internal", position: "after" },
      ],
      alphabetize: {
        order: "asc"
      },
      distinctGroup: false,
      pathGroupsExcludedImportTypes: ["react-hook-form"]
    }],
    'import/no-unresolved': ['error', {
      ignore: ['\\.css$']
    }],
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: __dirname,
        alwaysTryTypes: true,
      },
    },
    react: {
      version: '18',
    },
  },
  overrides: [
    {
      files: ["src/**/*.{ts,tsx}"],
      rules: {
        "no-console": 1,
        "@typescript-eslint/no-unused-vars": [2, { args: "none" }]
      }
    },
    {
      files: ["src/types/**/*.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": 0
      }
    }
  ],
  ignorePatterns: ['vite.config.ts', '.eslintrc.cjs'],
};
