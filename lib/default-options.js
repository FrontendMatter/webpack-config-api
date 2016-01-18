import path from 'path'

export default {
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
			fallback: [ path.join(process.cwd(), 'node_modules') ],
			// add support to require modules without an extension
			// the empty '' must be included to require modules with an extension
			extensions: [ '' ]
		},
		resolveLoader: {
			// fixes issues with linked npm packages
			fallback: [ path.join(process.cwd(), 'node_modules') ],
			// add support to require modules without an extension
			// the empty '' must be included to require modules with an extension
			extensions: [ '' ]
		},
		output: {
			filename: "[name].js"
		},
		module: {
			loaders: []
		},
		plugins: []
	}
}