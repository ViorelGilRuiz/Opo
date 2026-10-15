import js from "@eslint/js";
import globals from "globals";
export default [
  { ignores: ["node_modules/**", "dist/**", "tmp/**"] },
  js.configs.recommended,
  {
    files: ["app.js"],
    languageOptions: { globals: globals.browser, sourceType: "module" },
  },
  {
    files: ["scripts/**/*.mjs", "tests/**/*.mjs", "*.config.mjs"],
    languageOptions: { globals: globals.node },
  },
  { files: ["ui/**/*.mjs"], languageOptions: { globals: globals.browser } },
];
