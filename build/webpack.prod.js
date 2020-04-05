const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const prodConfig = {
	mode:'production',
	plugins:[
		new CleanWebpackPlugin(),
	]
}

module.exports = merge(baseConfig, prodConfig);