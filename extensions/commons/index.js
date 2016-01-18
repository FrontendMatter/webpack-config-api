var requireLink  = require('require-linked-peer')
var webpack = requireLink('webpack')

module.exports = function () {
	var args = Array.prototype.slice.call(arguments)
	if (!args.length) {
		args = ['common', 'common.js']
	}
	return this.withPlugin(
		'CommonsChunkPlugin', 
		this.createPlugin.apply(this, [webpack.optimize.CommonsChunkPlugin].concat(args))
	)
}