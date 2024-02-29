import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import dynamicImport from 'vite-plugin-dynamic-import';
// import importDynamicModule from 'vite-plugin-dynamic-import-module';
// import typescript2 from "rollup-plugin-typescript2";
// import keysTransformer from 'ts-transformer-keys/transformer';
import path from 'node:path';

// https://vitejs.dev/config/
export default ({ command, mode }) => {

  return defineConfig({
    // esbuild: command === 'build' ? false : {},
    plugins: [
      react(), 
      // dynamicImport()
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
      sourcemap: true,
      rollupOptions: {
        external: [
          /@reach\/.*/,
          /@react-aria\/.*/,
          /@react-icons\/.*/,
          /@react-stately\/.*/,
          /date-fns\/.*/,
          /lodash\/.*/,
          /react\/.*/,
          "date-fns",
          "downshift",
          "i18next",
          "query-string",
          "react-beautiful-dnd",
          "react-calendar",
          "react-dom",
          "react-error-boundary",
          "react-focus-lock",
          "react-hook-form",
          "react-i18next",
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
    // optimizeDeps: {
    //   include: [
    //     'date-fns/esm'
    //   ]
    // },
    server: {
      port: 3004,
    },
  });
}
