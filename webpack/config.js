// 使用 dotenv 设置环境变量，注意 dotenv 调用应该尽量靠前，在使用 process.env 之前调用
const dotenv = require('dotenv');
const DotenvWebpack = require('dotenv-webpack');
const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin'); // html模板文件处理
const Happypack = require('happypack'); // 多线程打包
const os = require('os');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // css提取为单独文件
const NODE_ENV = process.env.NODE_ENV;
// 除了development，还有production和test，后2个走同一套逻辑
const isDev = NODE_ENV === 'development';

// 输出高亮
const clc = {
  green: (text) => `\x1B[32m${text}\x1B[39m`,
  yellow: (text) => `\x1B[33m${text}\x1B[39m`,
  red: (text) => `\x1B[31m${text}\x1B[39m`,
  magentaBright: (text) => `\x1B[95m${text}\x1B[39m`,
  cyanBright: (text) => `\x1B[96m${text}\x1B[39m`,
};

// 获取命令参数
const argv = require('yargs').argv;
const currentEnv = argv['current-env'];

// 环境变量配置
const envConfigPath = {
  dev: path.resolve(__dirname, './env/.env.dev'), // 开发环境配置
  test: path.resolve(__dirname, './env/.env.test'), // 测试环境配置
  test2: path.resolve(__dirname, './env/.env.test2'), // 测试2环境配置
  uat: path.resolve(__dirname, './env/.env.uat'), // 预发布环境配置
  prod: path.resolve(__dirname, './env/.env.prod'), // 正式环境配置
  local: path.resolve(__dirname, '../.env'), // 自定义环境配置
};

// 根据命令行参数设置环境变量
const envConfig = dotenv.config({ path: envConfigPath[currentEnv] }).parsed;
if (!envConfig) {
  console.log(
    clc.red(`==========> ${envConfigPath[currentEnv]} 文件不存在，请按照 README.md 文档说明初始化 .env 文件`)
  );
  process.exit(1);
}

// 系统级环境变量，除非知道自已在干什么，否则尽量不自已改
console.log(clc.yellow(`==========> NODE_ENV=${process.env.NODE_ENV}`));

// 用户级环境变量，可通过 .env.*** 文件配置
console.log(clc.green(`==========> API_HOST=${process.env.API_HOST}`));
console.log(clc.green(`==========> SITE_HOST=${process.env.SITE_HOST}`));

// 开辟一个线程池
// 拿到系统CPU的最大核数，happypack 将编译工作灌满所有线程
const happyThreadPool = Happypack.ThreadPool({
  size: os.cpus().length,
});

const cssReg = /\.css$/;
const cssModuleReg = /\.module\.css$/;
const lessReg = /\.less$/;
const lessModuleReg = /\.module\.less$/;
const moduleOption = {
  localIdentName: isDev ? '[local]-[hash:base64:8]' : '[hash:base64]', // 类名 '[path][name]__[local]--[hash:base64:5]'
};
const cssLoaderWithModule = {
  loader: 'css-loader',
  options: {
    modules: moduleOption,
  },
};
const lessLoaderWithModule = {
  loader: 'less-loader',
  options: {
    modules: moduleOption,
  },
};

module.exports = (env, argv) => {
  const rootPath = path.resolve(__dirname, '../');
  console.log(`path.resolve(rootPath, './src/components')`, path.resolve(rootPath, './src/components'));
  return {
    stats: isDev ? 'errors-only' : 'errors-warnings', // 启动与构建时的log设置
    entry: {
      main: path.resolve(rootPath, './src/index.js'),
    },
    output: {
      path: path.resolve(rootPath, './dist'),
      filename: isDev ? 'js/[name].[hash:8].js' : 'js/[name].[chunkhash:8].js',
      publicPath: isDev ? '/' : `/xxxxx/`,
    },
    module: {
      rules: [
        {
          test: cssReg,
          exclude: cssModuleReg,
          use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: cssModuleReg,
          exclude: path.resolve(__dirname, './node_modules'),
          use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, cssLoaderWithModule],
        },
        {
          test: lessReg,
          exclude: lessModuleReg,
          use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'happypack/loader?id=less'],
        },
        {
          test: lessModuleReg,
          exclude: path.resolve(__dirname, './node_modules'),
          use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'happypack/loader?id=lessWithModule'],
        },
        {
          test: /(\.jsx|\.js)$/,
          // 一定要加这个 否则检测不到
          enforce: 'pre',
          exclude: /node_modules/,
          use: [
            {
              loader: 'eslint-loader',
              options: {
                // 不符合Eslint规则时只console warning(默认false 直接error)
                // emitWarning: true
                fix: true,
              },
            },
          ],
        },
        {
          test: /(\.jsx|\.js)$/,
          use: 'happypack/loader?id=js',
          exclude: /node_modules/,
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.ico$/],
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: isDev ? 'image/[name][hash:8].[ext]' : 'image/[name].[contenthash:8].[ext]',
          },
        },
        {
          test: /\.(woff|svg|eot|ttf)\??.*$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: isDev ? 'font/[name][hash:8].[ext]' : 'font/[name].[contenthash:8].[ext]',
          },
        },
      ],
    },
    plugins: [
      new DotenvWebpack({
        path: envConfigPath[currentEnv],
      }),
      new HtmlPlugin({
        template: path.resolve(rootPath, './index.html'),
        favicon: path.resolve(rootPath, './favicon.ico'),
        // html压缩
        minify: {
          collapseWhitespace: true,
          preserveLineBreaks: true,
        },
      }),
      new webpack.DefinePlugin({
        'process.env': {
          // production和test的唯一区别
          CURRENT_ENV: JSON.stringify(currentEnv),
        },
      }),
      new MiniCssExtractPlugin({
        filename: isDev ? 'css/[name][hash:8].css' : 'css/[name].[chunkhash:8].css',
        chunkFilename: isDev ? 'css/[id][hash:8].css' : 'css/[id].[chunkhash:8].css',
        ignoreOrder: false,
      }),
      new Happypack({
        id: 'js',
        threadPool: happyThreadPool,
        use: [
          'cache-loader',
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                '@babel/plugin-proposal-class-properties',
                ['import', { libraryName: 'antd-mobile', style: 'css' }],
              ],
            },
          },
        ],
      }),
      new Happypack({
        id: 'less',
        threadPool: happyThreadPool,
        use: ['css-loader', 'postcss-loader', 'less-loader'],
      }),
      new Happypack({
        id: 'lessWithModule',
        threadPool: happyThreadPool,
        use: [cssLoaderWithModule, 'postcss-loader', lessLoaderWithModule],
      }),
    ],
    resolve: {
      alias: {
        '@components': path.resolve(rootPath, './src/components'),
        '@config': path.resolve(rootPath, './src/config'),
        '@asset': path.resolve(rootPath, './src/asset'),
        '@mock': path.resolve(rootPath, './src/mock'),
        '@view': path.resolve(rootPath, './src/view'),
        '@util': path.resolve(rootPath, './src/util'),
        '@store': path.resolve(rootPath, './src/store'),
      },
      extensions: ['.jsx', '.js', '.json', '.styl', '.css'],
    },
  };
};
