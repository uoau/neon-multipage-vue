const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

const devConfig = {
	mode:'development',
	watch:true
}

module.exports = merge(baseConfig, devConfig);