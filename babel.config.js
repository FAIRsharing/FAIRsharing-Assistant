module.exports = {
  presets: [
    "@vue/cli-plugin-babel/preset",
    ['@babel/preset-env', {targets: {node: 'current'}}],
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-private-methods'
  ]
};