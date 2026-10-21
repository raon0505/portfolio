import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // 프로젝트 컨벤션 (AGENTS.md)
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message: "상위 경로는 @/ 별칭으로 import한다",
            },
            {
              group: ["tailwindcss", "styled-components", "@emotion/*"],
              message: "스타일은 CSS Modules + 전역 CSS 변수만 사용한다",
            },
          ],
        },
      ],
    },
  },
  {
    // 한 파일 = 한 컴포넌트, default export
    files: ["components/**/*.tsx"],
    rules: {
      "import/no-named-export": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Playwright 산출물
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
