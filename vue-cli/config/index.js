// 主要的配置文件  包含静态文件的路径,是否开启sourceMap等.包含dev开发环境的配置,build生产环境的配置

'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    // assetsPublicPath  打包后的文件路径
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // 代理的接口  可跨域
    proxyTable: {},

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // 端口 就是改这里
    autoOpenBrowser: true, // 这里是ture的话，就会自动打开浏览器
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,
    // 默认情况下，关闭 CSS Sourcemaps，因为使用相对路径会报错。
    cssSourceMap: true
  },

  build: {
    // 构建输出的index.html文件
    index: path.resolve(__dirname, '../dist/index.html'),

    // 构建输出的静态资源路径
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 构建输出的二级目录
    assetsSubDirectory: 'static',
    // 构建发布的根目录,可配置为资源服务器域名或者cdn域名
    assetsPublicPath: './',

    /**
     * Source Maps  是否开启cssSourceMap
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
