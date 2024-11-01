import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import viteConfig from './vite.config.mjs'
import {URL} from "url";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      server: {
        deps: {
          inline: ['vuetify']
        }
      },
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      transformMode: {
        web: [/\.[jt]sx$/]
      },
      coverage: {
        provider: 'v8', // or 'istanbul'
        exclude:[
          "src/main.js",
          "src/documentation/process_doc.js",
          "src/store/index.js",
          "src/plugins/**",
          "src/router/routes.js",
          "src/components/Icon/Icon.vue",
        ],
        reporter: ['text', 'lcov'],
        reportOnFailure: true,
      },
    }
  })
)