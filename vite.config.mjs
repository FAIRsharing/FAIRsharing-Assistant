import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import dns from "node:dns";
import eslintPlugin from "vite-plugin-eslint";
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import compress from 'vite-plugin-compress'

dns.setDefaultResultOrder("verbatim");

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);


export default defineConfig({
  base: "./",
  server:{
    host: true,
    open: true,
    port: 8082
  },
  preview: {
    host: true,
    open: true,
    port: 8083,
  },
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
    nodePolyfills(),
    compress
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "source-map-js": "source-map"
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue", ".svg"],
  },
  optimizeDeps: {
    include: ["vuetify"],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/index.scss";`,
        api: "modern-compiler", // or "modern"
      },
    },
  },
  // The important bit...
  // build: {
  //   lib: {
  //     // src/main.ts is where we have exported our component(s)
  //     entry: path.resolve(__dirname, "src/main.js"),
  //     // entry: ['src/main.js'],
  //     name: "FAIRsharing-Assistant",
  //     // the name of the output files when the build is run
  //     fileName: "FAIRsharing-Assistant",
  //   },
  //   rollupOptions: {
  //     input: {
  //       main: path.resolve(__dirname, 'index.html'),
  //     },
  //     // Make sure to exclude Vue from the bundle
  //     external: ["vue"],
  //     output: {
  //       // Provide global variables to use in the UMD build
  //       // for externalized deps
  //       globals: {
  //         vue: 'Vue',
  //       },
  //     },
  //   },
  // },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    target: 'es2015',
    cssCodeSplit: true,
  }
});
