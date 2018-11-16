'    strict'
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const config = require('./package.config')

//判断开发环境还是生产环境
const isProduction  = process.env.NODE_ENV === 'production' //设置为false——开发环境    // return true;  //设置为true——生产环境

// 组装入口文件
const entryFiles = function entryFiles() {
    let entryObj = {}
    // 判断是否配置入口文件
    const entries = config.dirs.entries
    if(entries === undefined || entries === 0) {
        throw ('[ERROR]: list of entry files can not be null')
    }
    entries.map(item => {
        fs.statSync(item, (err, state) => {
            if(err) {
                throw ('[ERROR]: entry ' + item + ' is not a correct path')
            }
        })
        const bundlePath = item.replace(/^\.\//, '').replace(/\.js/, '')
        entryObj[bundlePath] = item
    })
    return entryObj
}


const outputDir = function outputDir() {
    fs.statSync(config.dirs.outputDir, (err, state) => {
        if(err) {
            throw ('[ERROR]: bundle output dir is not exsit')
        }
    })
    console.log('---------', path.join(__dirname, config.dirs.outputDir))
    return path.join(__dirname, config.dirs.outputDir)
}

const getPlugins = function getPlugins() {
    let plugins = []
    // 抽取 css 文件
    plugins.push(new ExtractTextPlugin({
        filename: isProduction ? '[name].[chunkhash].bundle.css' : '[name].bundle.css',
        disable: !config.extractCss,
        allChunks: true
    }))
    plugins.push(
        new webpack.optimize.ModuleConcatenationPlugin()
    )
    isProduction && plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    )
    plugins.push(
        new webpack.DefinePlugin(config.globalVar)
    )
    isProduction && plugins.push(
        new ManifestPlugin({
            filename: 'manifest.json',
            publicPath: config.dirs.outputDir + '/',
        })
    )
    return plugins
}

const moduleConfig = {
    rules: [
        {
            test: /\.vue$/,
            use: [
               {
                  loader: 'vue-loader',
                  options: {
                    extractCSS: config.extractCss
                  }
               },
               // {
               //    loader: 'iview-loader',
               //    options: {
               //      prefix: false
               //    }
               // }
            ],
            exclude: /node_modules/
        },
        {
            test: /iview.src.*?.js$/,
            use: ['babel-loader'],
            exclude: /node_modules/
        },
        {
            test: /\.js$/,
            use: ['babel-loader'],
            exclude: /node_modules/
        },
        // {
        //     test: /\.vue$/,
        //     loader: 'vue-loader',
        //     exclude: /node_modules/,
        //     options: {
        //         extractCSS: config.extractCss
        //     }
        // },
        {
            test: /\.ts(x?)$/,
            use: [
                {
                    loader: 'babel-loader'
                },
                {
                    loader: 'ts-loader'
                }
            ]
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader"
          })
        },
        {
            test: /\.less$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract([
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        minimize: isProduction
                    }
                },
                {
                    loader: 'less-loader'
                },
                {
                    loader: 'postcss-loader'
                }])
        },
        // {
        //     test: /\.(jpe?g|png|gif|svg)$/i, 
        //     loader: 'url-loader',
        //     options: {
        //         limit: 500, //图片大小超过0.5kb, 不压缩入 bundle 
        //         name: 'images/[name].[ext]'  //图片输出路径
        //     }
        // }
        {
          test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
          loader: 'url-loader?limit=10000',
          options: {
             limit: 500, //图片大小超过0.5kb, 不压缩入 bundle 
             name: 'images/[name].[ext]'  //图片输出路径
          }
        }
    ]
}

module.exports = {
    devtool: isProduction ? '' : 'cheap-eval-source-map',
    entry: entryFiles(),
    output: {
        filename: isProduction ? '[name].[chunkhash].bundle.js' : '[name].bundle.js',
        path: outputDir()
    },
    module: moduleConfig,
    plugins: getPlugins(),
    node: {
        fs: "empty"
     },
    resolve: {
      alias: {
        'vue': 'vue/dist/vue.js',
        'iview': 'iview/dist/iview.js'
      },
      extensions:['.js', '.json', '.css', '.jpg', '.png']
    },
    performance: {  //开发环境下不显示包过大警告
        hints: false
    }
}