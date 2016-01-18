'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	distPath: 'dist',
	srcPath: 'src',
	outputPath: 'build',
	publicPath: true,
	// plugins
	plugins: {
		// global
		enabled: false,
		// Plugin hash
		plugin: {}
	},
	extensions: {},
	// webpack options
	webpack: {
		entry: {},
		resolve: {
			// fixes issues with linked npm packages
			fallback: [_path2.default.join(process.cwd(), 'node_modules')],
			// add support to require modules without an extension
			// the empty '' must be included to require modules with an extension
			extensions: ['']
		},
		resolveLoader: {
			// fixes issues with linked npm packages
			fallback: [_path2.default.join(process.cwd(), 'node_modules')],
			// add support to require modules without an extension
			// the empty '' must be included to require modules with an extension
			extensions: ['']
		},
		output: {
			filename: "[name].js"
		},
		module: {
			loaders: []
		},
		plugins: []
	}
};