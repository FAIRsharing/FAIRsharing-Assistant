module.exports = {
  testEnvironment: "jsdom",
  collectCoverage: true,
  coverageReporters: ["lcov", "html"],
  collectCoverageFrom: [
    "src/**/*.{js,vue}",
    "!src/main.js",
    "!src/documentation/process_doc.js",
    "!src/store/index.js",
    "!src/plugins/**",
    "!src/router/routes.js",
    "!src/components/Icon/Icon.vue",
  ],
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
  testMatch: [
    "**/**.spec.js",
    "**/**/**.spec.js",
    "tests/**/**.spec.js",
    "tests/**/**/**.spec.js",
  ],
  setupFiles: ["./jest-setup.js", "trace-unhandled/register"],
  moduleFileExtensions: ["js", "json", "vue"],
  transform: {
    "^.*\\.js$": "babel-jest",
    ".*\\.(vue)$": "@vue/vue3-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!vue-router|@babel|vuetify|tsparticles)",
  ],
};
