const {
  resolve,
} = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 定义nodejs环境变量：决定使用browserslist的哪个环境
process.env.NODE_ENV = 'production';

/*
  tree shaking：去除无用代码
    前提：1. 必须使用ES6模块化  2. 开启production环境
    作用: 减少代码体积

    在package.json中配置
      "sideEffects": false 所有代码都没有副作用（都可以进行tree shaking）
        问题：可能会把css / @babel/polyfill （副作用）文件干掉
      "sideEffects": ["*.css", "*.less"]
*/

// 复用loader
const commonCssLoader = [
  // 'style-loader',
  miniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: [
        // 还需要在package.json中定义browserslist
        require('postcss-preset-env'),
      ],
    },
  },
];
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.[contenthash:10].js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      /*
          正常来讲，一个文件只能被一个loader处理。
          当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序：
            先执行eslint 在执行babel
        */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // 优先执行
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          fix: true,
        },
      },
      {
        // 以下Loader只会匹配一个
        // 注意：不能有两个配置处理同一种类型文件
        oneOf: [
          {
            test: /\.css$/,
            use: [
              ...commonCssLoader,
            ],
          },
          {
            test: /\.less$/,
            use: [
              ...commonCssLoader,
              'less-loader',
            ],
          },

          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
            // 预设：指示babel做怎么样的兼容性处理
              presets: [
                [
                  '@babel/preset-env',
                  {
                  // 按需加载
                    useBuiltIns: 'usage',
                    // 指定core-js版本
                    corejs: {
                      version: 3,
                    },
                    // 指定兼容性做到哪个版本浏览器
                    targets: {
                      chrome: '60',
                      firefox: '60',
                      ie: '9',
                      safari: '10',
                      edge: '17',
                    },
                  },
                ],
              ],
              // 开启babel缓存
              // 第二次构建时，会读取之前的缓存
              cacheDirectory: true,
            },
          },
          {
          // 问题：默认处理不了html中img图片
          // 处理图片资源
            test: /\.(jpg|png|gif)$/,
            // 使用一个loader
            loader: 'url-loader',
            options: {
            // 图片大小小于8kb，就会被base64处理
            // 优点: 减少请求数量（减轻服务器压力）
            // 缺点：图片体积会更大（文件请求速度更慢）
              limit: 8 * 1024,
              // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
              // 解析时会出问题：[object Module]
              // 解决：关闭url-loader的es6模块化，使用commonjs解析
              esModule: false,
              // 给图片进行重命名
              // [hash:10]取图片的hash的前10位
              // [ext]取文件原来扩展名
              name: '[hash:10].[ext]',
              outputPath: 'imgs',
            },
          },
          {
            test: /\.html$/,
            // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
            loader: 'html-loader',
          },
          // 打包其他资源(除了html/js/css资源以外的资源)
          {
          // 排除css/js/html资源
            exclude: /\.(css|js|html|less|jpg|png|gif")$/,
            loader: 'file-loader',
            options: {
              name: '[hash:10].[ext]',
              outputPath: 'media',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new miniCssExtractPlugin({
      filename: 'css/built.[contenthash:10].css',
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true,
      },
    }),
  ],
  mode: 'production',
  devtool: 'source-map',
};
