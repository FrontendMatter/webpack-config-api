var requireLink  = require('require-linked-peer')
var webpack = requireLink('webpack')
var ExtractTextPlugin = requireLink('extract-text-webpack-plugin')

/**
 * webpack-config-api-extract
 * @return {WebpackConfig} Instance.
 */
module.exports = function () {
	// cleanup
	this.removeListener('config', extract)

	// init
	var args = Array.prototype.slice.call(arguments)
	if (!args.length) {
		args.push('[name].css')
	}
	this.withPlugin(
		'ExtractTextPlugin',
		this.createPlugin.apply(this, [ExtractTextPlugin].concat(args)),
		{ publicPath: '' }
	)
	this.on('config', extract)
	return this
}

/**
 * Extract CSS into separate files
 */
function extract () {
	if (this.hasPlugin('ExtractTextPlugin')) {
		const styleLoadersMap = {
			'css': 'css',
			'less': 'less',
			'sass': 'scss'
		}
		Object.keys(styleLoadersMap).forEach(function (loaderName) {
			var extension = styleLoadersMap[loaderName]
			this.getLoadersByExtension(extension, this.config).forEach(function (loader) {
				var styleLoaders = loader.loader.loader.split('!')
				loader.loader.loader = ExtractTextPlugin.extract(
					styleLoaders.shift(), 
					styleLoaders.join('!'), 
					this.instOptions.plugins.plugin.ExtractTextPlugin.options
				)
				this.config.module.loaders[loader.index] = loader.loader
			}, this)
		}, this)
	}
}