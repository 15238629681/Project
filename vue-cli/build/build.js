// 开发环境的入口文件(为构建打包文件,会将源码进行构建(编译,压缩)后打包)

'use strict'
require('./check-versions')()
// 设置当前的环境为生产环境
process.env.NODE_ENV = 'production'  

const ora = require('ora')
// node中使用rm -rf的工具
const rm = require('rimraf')
const path = require('path')
// 终端输出带颜色的文字
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
// 终端显示loading效果,并输出提示
const spinner = ora('building for production...')
spinner.start()

// 删除这个文件夹(递归删除)
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  // 构建
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    // 打印提示
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
