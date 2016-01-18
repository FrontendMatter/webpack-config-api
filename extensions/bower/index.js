var requireLink  = require('require-linked-peer')
var webpack = requireLink('webpack')
var path = require('path')

module.exports = function () {
	return this.webpack({
		resolve: {
			root: [ 
				path.join(process.cwd(), 'bower_components')
			]
		}
	})
	.withPlugin(
		'BowerResolverPlugin', 
		new webpack.ResolverPlugin(
			new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
		)
	)
}