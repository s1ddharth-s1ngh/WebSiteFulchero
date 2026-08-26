import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts", "scripts/**"],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },
];

export default eslintConfig;
