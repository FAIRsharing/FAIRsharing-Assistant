//
// module.exports = {
//   env: {
//     test: {
//       presets: [
//         [
//           "@babel/preset-env",
//           {
//             targets: {
//               node: "current",
//             },
//           },
//         ],
//       ],
//     },
//   },
// }



module.exports = {
  presets: [
    "@babel/preset-env",
    "@vue/cli-plugin-babel/preset",

  ],
  plugins: [
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-private-methods'
  ]
};