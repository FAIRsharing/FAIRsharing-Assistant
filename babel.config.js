module.exports = {
  presets: [
    "@vue/cli-plugin-babel/preset",
    "@babel/preset-env",
  ],
  plugins: [
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-private-methods'
  ]
};