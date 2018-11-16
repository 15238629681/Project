'use strict'
module.exports = {
    plugins: [
        require('precss'),
        require('autoprefixer')({browserslist: ["> 1%",
                                                "last 2 versions"]})
    ]
}