import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
// import typescript2 from "rollup-plugin-typescript2";
// import keysTransformer from 'ts-transformer-keys/transformer';
const path = require("path");

// https://vitejs.dev/config/
export default ({ command, mode }) => {

  return defineConfig({
    // esbuild: command === 'build' ? false : {},
    plugins: [
      reactRefresh(),
      // {...typescript2({ 
      //   check: false,
      //   transformers: [service => ({
      //     before: [ keysTransformer(service.getProgram()) ],
      //     after: []
      //   })] 
      // })}
      // {
      //   ...typescript2({
      //     clean: true,
      //     check: false,
      //     tsconfigOverride: {
      //       include: ["./lib"],
      //       compilerOptions: {
      //         declaration: true
      //       },
      //     },
      //   }),
      //   apply: "build",
      // },
    ],
    build: {
      lib: {
        entry: path.resolve(__dirname, "lib/main.ts"),
        name: "SpaceYard",
      },
      rollupOptions: {
        external: [
          "@reach/dialog",
          "date-fns",
          "downshift",
          "i18next",
          "lodash/defaults",
          "lodash/omit",
          "lodash/pick",
          "lodash/uniqueId",
          "query-string",
          "react-dom",
          "react-error-boundary",
          "react-focus-lock",
          "react-hook-form",
          "react-i18next",
          "react-icons/fi",
          "react-popper",
          "react-router",
          "react-router-dom",
          "react-spring",
          "react-toastify",
          "react",
          "zustand"
        ],
        output: {
          globals: {
            // react: "React",
          },
        },
      },
    },
    server: {
      port: 3004,
    },
  });
}
