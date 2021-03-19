const config = require('./config');
const merge = require('webpack-merge');

module.exports = (env, argv) => {
  return merge(config(env, argv), {
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      host: '0.0.0.0',
      port: 3333,
      open: 'http://127.0.0.1:3333/home',
      hot: true,
      historyApiFallback: true,
      disableHostCheck: true, // 防止Invalid Host header的报错
      overlay: {
        errors: true,
        warnings: true,
      },
      proxy: [
        {
          context: ['/caizhi_miniapi', '/api', '/caizhi_minifile', '/base'],
          target: process.env.API_HOST,
          secure: false,
          changeOrigin: true,
        },
      ],
    },
  });
};
