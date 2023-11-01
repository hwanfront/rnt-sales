module.exports = {
  env: {
    browser: false,
    node: true
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "prettier"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  rules: {
    "prettier/prettier": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off"
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