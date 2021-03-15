import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import typescript2 from "rollup-plugin-typescript2";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    {
      ...typescript2({
        check: false,
        tsconfigOverride: {
          include: ["./lib"],
          compilerOptions: {
            declaration: true,
          },
        },
      }),
      apply: "build",
    },
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/main.ts"),
      name: "SpaceYard",
    },
    rollupOptions: {
      external: [
        "downshift",
        "react-dom",
        "react-focus-lock",
        "react-router",
        "react",
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
