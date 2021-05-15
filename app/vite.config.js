import { resolve } from "path";

import dotenv from "dotenv";
import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import tsconfigPaths from "vite-tsconfig-paths";

dotenv.config();

// https://vitejs.dev/config/
export default (mode) => {
  return defineConfig({
    server: {
      port: 42007,
    },

    resolve: {
      alias: [
        {
          find: /^~@darekkay\/styles/,
          replacement: resolve(__dirname, "node_modules/@darekkay/styles"),
        },
      ],
    },

    define: {
      "process.env.NODE_ENV": `"${mode}"`,
      "process.env.APP_VERSION": `"${process.env.npm_package_version}"`,
      "process.env.DASHBOARD_API_BASE_URL": `"${process.env.DASHBOARD_API_BASE_URL}"`,
      "process.env.DASHBOARD_IS_STORAGE_PAUSED": `"${process.env.DASHBOARD_IS_STORAGE_PAUSED}"`,
    },

    build: {
      outDir: "build",

      rollupOptions: {
        output: {
          // https://github.com/facebook/regenerator/issues/378
          intro: "window.regeneratorRuntime = undefined;",
        },
      },
    },

    // TODO: check if it doesn't break widgets
    plugins: [reactRefresh(), tsconfigPaths()],
  });
};
