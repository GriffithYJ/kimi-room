import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // React Compiler rules ship in eslint-plugin-react-hooks 7 and next/core-web-vitals
  // turns them on as errors. They fire on idiomatic client-only patterns that are
  // correct here, not bugs to fix:
  //   set-state-in-effect → SSR-safe hydration: read localStorage/cookie in a mount
  //     effect, then setState (those APIs are unavailable during server render).
  //   refs → latest-value refs mirrored into a requestAnimationFrame loop (GraphView).
  //   purity → current-date read for a day-of-month icon (Footer).
  // Kept as warnings: they stay visible without blocking CI, since satisfying them
  // would mean restructuring working hydration logic.
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
    },
  },
]);

export default eslintConfig;
