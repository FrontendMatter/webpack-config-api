var path = require('path')
var fs = require('fs')

module.exports = function () {
	var configFile = path.resolve(process.cwd(), '.eslintrc')
	if (!fs.existsSync(configFile)) {
		configFile = path.resolve(__dirname, '.eslintrc')
	}
	return this.webpack({
		eslint: {
			configFile: configFile
		}
	})
}