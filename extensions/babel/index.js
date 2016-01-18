var requireLink = require('require-linked-peer')
var resolve = require('resolve')

function resolveLink(path) {
	return resolve.sync(path, { basedir: process.cwd() })
}

module.exports = function (loaderOptions, babelOptions) {
	// These are the default babel-loader options
	// but resolveLink is needed to fix issues with linked npm modules
	// See https://github.com/babel/babel-loader/issues/166
	var presets = (babelOptions && typeof babelOptions.presets !== 'undefined' ? babelOptions.presets : ['es2015']).map(function(preset) {
		return resolveLink('babel-preset-' + preset)
	})
	var plugins = (babelOptions && typeof babelOptions.plugins !== 'undefined' ? babelOptions.plugins : ['transform-runtime']).map(function(plugin) {
		return resolveLink('babel-plugin-' + plugin)
	})
	return this.addLoader(
		this.extend({
			test: /\.js$/,
			loader: 'babel!eslint',
			exclude: [],
			include: [ this.srcPath() ]
		}, loaderOptions || {})
	)
	.webpack({
		babel: {
			presets: presets,
			plugins: plugins
		}
	})
}