const config = require('./config');
const merge = require('webpack-merge'); // 深度合并方法
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // css压缩
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 打包前清空dist文件夹
// const CompressionPlugin = require('compression-webpack-plugin') // 压缩js文件为gz文件
const TerserWebpackPlugin = require('terser-webpack-plugin'); // js压缩
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin'); // 构建时性能监测
const smp = new SpeedMeasurePlugin();

module.exports = (env, argv) => {
  return smp.wrap(
    merge(config(env, argv), {
      devtool: false,
      plugins: [new CleanWebpackPlugin()],
      optimization: {
        splitChunks: {
          cacheGroups: {
            commons: {
              name: 'vendor',
              chunks: 'initial',
              minChunks: 2,
            },
          },
        },
        minimizer: [
          new TerserWebpackPlugin({
            parallel: true,
            terserOptions: {
              output: {
                comments: false,
                ascii_only: true,
              },
              compress: {
                drop_console: false,
                drop_debugger: true,
                comparisons: false,
              },
              safari10: true,
            },
          }),
          new OptimizeCSSAssetsPlugin({}),
        ],
      },
    })
  );
};
