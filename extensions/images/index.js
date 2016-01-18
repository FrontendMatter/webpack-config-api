module.exports = function () {
	return this.addLoader({
		test: /\.(png|jpg)$/, 
		loader: 'url', 
		query: {
			// limit for base64 inlining in bytes
			limit: 10000,
			// custom naming format if file is larger
			// than the threshold
			name: '[name].[ext]?[hash]'
		} 
	})
}