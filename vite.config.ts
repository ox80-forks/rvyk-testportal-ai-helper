import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        content: resolve(__dirname, "content.js"),
        background: resolve(__dirname, "background.js"),
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
    },
    outDir: "./dist",
    emptyOutDir: false,
  },
});
