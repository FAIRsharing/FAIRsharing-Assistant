const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  chainWebpack(config) {
    config.plugins.delete('prefetch');
    config.plugin('CompressionPlugin').use(CompressionPlugin);
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2
            }
          }
        }
      })
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/styles/index.scss";`,
      },
    },
  }
}