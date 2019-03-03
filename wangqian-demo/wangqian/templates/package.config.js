// package.config.js

//打包路径配置
let dirs = {
    entries: [
        './page/index.js',
        // './page/main/index.js'
    ],
    //将打包结果输出到目标路径, 为空时，打包后文件输出到 assets 目录
    outputDir: '../static/bundles' //支持一个输出路径
}

//是否提取css为单独文件从
let extractCss = true

//跨域调试 host， 一般不用
let hostName = ''

// 静态文件路径缩写
let staticPathPrefix = '{{ STATIC_URL }}'

// 全局变量定义
let isProduction = process.env.NODE_ENV === 'production'
let globalVar = {}
if(isProduction) {
    globalVar['STATICPATH'] = JSON.stringify('//static.syzljh.cn/')
} else {
    globalVar['STATICPATH'] = JSON.stringify('/static/')
}

let config = {
    dirs: dirs,
    extractCss: extractCss,
    hostName: hostName,
    staticPathPrefix: staticPathPrefix,
    globalVar: globalVar
}

module.exports = config