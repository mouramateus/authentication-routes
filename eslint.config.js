import tseslint from "typescript-eslint";

export default {
  ignores: ["node_modules", "dist"],
  plugins: {
    "@typescript-eslint": tseslint.plugin,
  },
  languageOptions: {
    parser: tseslint.parser,
  },
  rules: {
    "no-unused-vars": "warn",
    "no-console": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
};
