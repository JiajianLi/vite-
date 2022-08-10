// const path = require('path')

module.exports = {
    mode: 'development',
    entry: './index.js',
    output: {
        // filename: "[name].[contenthash:8].js", // 输出文件名
        filename: "dist.wpk.js", // 输出文件名
    },
    devtool:false
    // optimization: {
    //     minimize: false
    // }
}