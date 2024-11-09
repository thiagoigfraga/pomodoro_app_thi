import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import electron from "vite-plugin-electron/simple";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`
        entry: "electron/main.ts",
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`
        input: "electron/preload.ts",
      },
      // Optional: Use Node.js API in the Renderer process
      renderer: {},
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
