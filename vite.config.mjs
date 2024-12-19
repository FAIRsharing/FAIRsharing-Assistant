import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import dns from "node:dns";
import eslintPlugin from "vite-plugin-eslint";

dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  base: "./",
  test: {
    environment: "jsdom",
    globals: true,
  },
  plugins: [
    vue({ template: { transformAssetUrls } }),
    vuetify({
      autoImport: true,
    }),
    eslintPlugin,
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue", ".svg"],
  },
  optimizeDeps: {
    include: ["vuetify"],
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // or "modern"
      },
    },
  },
  // The important bit...
  build: {
    // lib: {
    //   // src/main.ts is where we have exported our component(s)
    //   entry: resolve(__dirname, "src/main.js"),
    //   name: "MyComponentLibrary",
    //   // the name of the output files when the build is run
    //   fileName: "ui-library",
    // },
    rollupOptions: {
      // Make sure to exclude Vue from the bundle
      external: ["vue"],
    },
  },
});
