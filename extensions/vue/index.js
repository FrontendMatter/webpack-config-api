var requireLink = require('require-linked-peer')
var ExtractTextPlugin = requireLink('extract-text-webpack-plugin')

module.exports = function (options) {
	// cleanup
	this.removeListener('config', extract)

	// init
	this.addFileExtension('vue')
		.addLoader({ test: /\.vue$/, loader: 'vue' })
		.webpack({
			vue: this.extend({
				loaders: {
					css: 'style!css',
					less: 'style!css!less',
					sass: 'style!css!sass',
					// important!
					// use vue-html-loader instead of html-loader
					// with .vue files
					html: 'vue-html',
					// Linting JavaScript in .vue files
					js: 'babel!eslint'
				}
			}, options || {})
		})

	this.on('config', extract)
	return this
}

/**
 * extract CSS into a separate files
 */
function extract () {
	if (this.hasPlugin('ExtractTextPlugin')) {
		const styleLoaders = ['css', 'less', 'sass']
		const plugin = this.getPlugin('ExtractTextPlugin')
		styleLoaders.forEach(function (loaderName) {
			var vueLoaders = this.config.vue.loaders[loaderName].split('!')
			this.instOptions.webpack.vue.loaders[loaderName] = ExtractTextPlugin.extract(
				vueLoaders.shift(), 
				vueLoaders.join('!'), 
				this.instOptions.plugins.plugin.ExtractTextPlugin.options
			)
		}, this)
	}
}