'use strict'
const fs = require('fs')
const path = require('path')
const config = require('./package.config')

// 用于生成正则匹配
const isProduction  = process.env.NODE_ENV === 'production'

// 删除没用的 bundle 文件
const delAbandonedFile = function delAbandonedFile(filePath) {
    if(fs.statSync(filePath) && fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath)
    } else {
        console.log('>>>>> 文件' + filePath + '删除失败， 请确认后手动删除 <<<<<')
    }
}

//加载 打包结果文件 manifest.json 内容
const getManifest = function getManifest() {
    try {
        const filePath = path.join(config.dirs.outputDir, 'manifest.json')
        const bundles = JSON.parse(fs.readFileSync(filePath))
        let bndObj = {}
        for(let key in bundles) {
            let keypath = key.split('.')[0]
            !bndObj[keypath] && (bndObj[keypath] = {})
            let prefix = '{{STATIC_URL}}'
            if(bundles[key].indexOf('shtml') > -1) {
                prefix = '/static/'
            }
            if(bundles[key].indexOf('.css') > -1) {
                bndObj[keypath]['css'] = prefix +  bundles[key].replace(config.dirs.outputDir, 'bundles')
            } else if(bundles[key].indexOf('.js') > -1) {
                bndObj[keypath]['js'] = prefix + bundles[key].replace(config.dirs.outputDir, 'bundles')
            }
        }
        // 删除 manifest 文件
        delAbandonedFile(filePath)
        return bndObj
    } catch(err) {
        throw err
    }
}

// 生成新的 Template 文件内容
const genNewContext = function genNewContext(content, bundle) {
    let retObj = {}
    if(bundle.js) {
        //如果存在 js 文件
        let bundleJsOld = /src=.+bundles.+\.bundle\.js("|')/.exec(content)
        bundleJsOld && (bundleJsOld = bundleJsOld[0].replace(/src=/, '').replace(/[",']/g, ''))
        if(!bundleJsOld) {
            // bundle 未添加至模板
           return {state: 'error', code: 1, detail: 'bundle.js is not yet add to template', updated: false} 
        } else if(bundleJsOld == bundle['js']) {
            return {state: 'error', code: 2, detail: 'bundle.js name is not changed', updated: false}
        } else {
            console.log('bunodljs--', bundleJsOld)
            retObj = {
                'state': 'ok',
                'code': 0,
                'updated': true,
                'oldjs': bundleJsOld
            }
            content = content.replace(/src=.+bundles.+\.bundle\.js("|')/, 'src="' + bundle['js'] + '"')
        }

        //替换 CSS
        if(bundle.css) {
            let bundleCssOld = /href=.+bundles.+\.bundle\.css("|')/.exec(content)
            bundleCssOld && (bundleCssOld = bundleCssOld[0].replace(/href=/, '').replace(/[",']/g, ''))
            if(!bundleCssOld) {
                retObj.state = 'warning'
                retObj.code = 3
                retObj.detail = 'bundle.css is not yet add to template' 
                retObj.updated = true
            } else if(bundleCssOld == bundle['css']) {
                retObj.state = 'warning'
                retObj.code = 4
                retObj.detail = 'bundle.css name is note changed' 
                retObj.updated = true
            } else {
                console.log('bunodlcss--', bundleCssOld)
                retObj.oldcss = bundleCssOld
                content = content.replace(/href=.+bundles.+\.bundle\.css("|')/, 'href="' + bundle['css'] + '"')
            }
        }
        retObj.content = content
        return retObj
    }
}

// 生成新的 template 文件
const genNewTemplate = function genNewTemplate(bundles) {
    for(let key in bundles) {
        try {
            //获取模板内容
            let filePath = './' + key + '.html'
            let tempContent = ''
            if(fs.statSync(filePath)) {
                tempContent = fs.readFileSync(filePath).toString()
            }
            let retObj = genNewContext(tempContent, bundles[key])
            if(retObj.code === 1) {
                console.log('>>>>> 请确认文件' + filePath + '中包含有 bundle.js 的 scripte 标签 <<<<<')
            } else if(retObj.code === 2) {
                console.log('>>>>> 文件' + filePath + '中 bundle.js 未更新， 请确认 <<<<<')
            } else if(retObj.code === 0 || retObj.code > 2) {
                // 写入 template 文件
                if(retObj.code === 3) {
                    console.log('>>>>> 请确认文件 ' + filePath + ' 中包含有 bundle.css 的 link 标签 <<<<<')
                } else if(retObj.code === 4) {
                    console.log('>>>>> 文件' + filePath + ' bundle.css 未更新 <<<<<')
                }

                fs.writeFile(filePath, retObj.content, (err, data) => {
                    if(err) {
                        throw('[Error]: failed to update template', filePath)
                    }
                })
                // 删除文件
                if(retObj.oldjs) {
                    console.log('jsFile before', retObj.oldjs)
                    let jsFile = config.dirs.outputDir + retObj.oldjs.replace(/.+bundles/, '')
                    console.log('jsFile', jsFile)
                    delAbandonedFile(jsFile)
                }
                if(retObj.oldcss) {
                    console.log('cssFile before', retObj.oldcss)
                    let cssFile = config.dirs.outputDir + retObj.oldcss.replace(/.+bundles/, '')
                    console.log('cssFile', cssFile)
                    delAbandonedFile(cssFile)
                }
            }
        } catch(err) {
            // throw err
            console.log(err)
        }
    }
}

if(isProduction) {
    let bundles = getManifest()
    genNewTemplate(bundles)
} else {
    //根据入口文件组装所有 bundle 文件
    let bundles = {}
    let entries = config.dirs.entries
    let len = entries.length
    for(let i = 0; i < len; i++) {
        let entry = entries[i]
        let prefix = '{{STATIC_URL}}'
        if(entry.indexOf('shtml') > -1) {
            prefix = '/static/'
        }
        entry = entry.replace('./', '').replace('.js', '')
        bundles[entry] = {
            'js': prefix +  'bundles/' + entry + '.bundle.js'
        }
        if(config.extractCss) {
            bundles[entry]['css'] = prefix + 'bundles/' + entry + '.bundle.css'
        }
    }
    // console.log(bundles)
    genNewTemplate(bundles)
}