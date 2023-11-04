module.exports = {
  env: {
    browser: false,
    node: true
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "import",
    "@typescript-eslint",
    "prettier",
    "unused-imports"
  ],
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  rules: {
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "import/order": ["error", {
      "newlines-between": "always",
      groups: [
        "external",
        "internal",
        "type",
      ],
      pathGroups: [
        { pattern: "@api", group: "internal", position: "after" },
        { pattern: "@middleware", group: "internal", position: "after" },
        { pattern: "@config", group: "internal", position: "after" },
        { pattern: "@routes/*", group: "internal", position: "after" },
        { pattern: "@interfaces/*", group: "internal", position: "after" },
        { pattern: "@loaders", group: "internal", position: "after" },
        { pattern: "@loaders/*", group: "internal", position: "after" },
        { pattern: "@models", group: "internal", position: "after" },
        { pattern: "@models/*", group: "internal", position: "after" },
        { pattern: "@services/*", group: "internal", position: "after" },
        { pattern: "@utils/*", group: "internal", position: "after" }
      ],
      alphabetize: {
        order: "asc"
      },
      distinctGroup: false
    }],
    "import/no-unresolved": "error",
    "prettier/prettier": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2023,
    sourceType: "module",
    ecmaFeatures: {
      jsx: false
    }
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: __dirname,
        alwaysTryTypes: true
      },
    }
  },
  overrides: [
    {
      files: ["src/**/*.ts"],
      rules: {
        "no-console": 1,
        "prettier/prettier": 2,
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
  ignorePatterns: [
    "node_modules/",
    ".eslintrc.js"
  ]
}
