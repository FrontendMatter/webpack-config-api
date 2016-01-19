import path from 'path'
import fs from 'fs'
import extend from './extend.js'
import qs from 'webpack-query-string'
import defaultOptions from './default-options'
import forOwn from 'lodash/forOwn'
import requireLink from 'require-linked-peer'
import { EventEmitter } from 'events'
const webpack = requireLink('webpack')
import _ from 'lodash'

// requiring module __dirname
const dirname = path.dirname(module.parent.filename)

class WebpackConfig extends EventEmitter {

	/**
	 * Construct WebpackConfig.
	 * @param  {Object} options Use options.
	 */
	constructor (options) {

		super()

		// apply default options
		this.withDefaultOptions()

		// load user options
		this.loadOptions()

		if (options) {
			this.options(options)
		}
	}

	/**
	 * Extend options
	 * @param  {Object} options 	The options to apply.
	 * @param  {boolean} reset   	Reset the options instead of extending.
	 * @return {WebpackConfig}      Instance.
	 */
	options (options, reset) {
		options = _.cloneDeep(options)
		this.instOptions = reset ? options : extend(this.instOptions || {}, options)
		return this
	}

	/**
	 * Load user options from a file within the requiring module dirname.
	 * @param  {String} filename  	The filename.
	 * @return {WebpackConfig}      Instance.
	 */
	loadOptions (filename = 'base.config.js') {
		const configPath = path.resolve(dirname, filename)
		if (fs.existsSync(configPath)) {
			this.options(require(configPath))
		}
		return this
	}

	/**
	 * Reset to default options.
	 * @return {WebpackConfig} Instance.
	 */
	withDefaultOptions () {
		return this.options(defaultOptions, true)
	}

	/**
	 * Expose webpack-query-string utility.
	 * Create a webpack friendly query string from input object.
	 * @return {String} A query string.
	 */
	qs () {
		return qs.apply(qs, arguments)
	}

	/**
	 * Expose extend utility.
	 * Recursively extends objects and arrays using a union merge strategy.
	 * @return {Object} The extended object.
	 */
	extend () {
		return extend.apply(extend, arguments)
	}

	/**
	 * Resolve a path within options.srcPath
	 * @return {String} The resolved path.
	 */
	srcPath () {
		var paths = Array.prototype.slice.call(arguments, 0)
		paths.unshift(this.instOptions.srcPath)
		return path.resolve(process.cwd(), path.join.apply(path, paths))
	}

	/**
	 * Extend options.webpack
	 * @param  {Object} options 	The options
	 * @param  {boolean} reset   	Replace instead of extend.
	 * @return {WebpackConfig}      Instance.
	 */
	webpack (options, reset) {
		this.instOptions.webpack = reset ? options : extend(this.instOptions.webpack || {}, options)
		return this
	}

	/**
	 * Register an extension
	 * @param  {string} id 			The extension id.
	 * @param  {string} extension 	The extension callback.
	 * @return {WebpackConfig} 		Instance.
	 */
	register (id, extension) {
		var args = Array.prototype.slice.call(arguments, 2)
		var extensions = {
			extensions: {}
		}
		extensions.extensions[id] = {
			callback: extension,
			options: args
		}
		return this.options(extensions)
	}

	/**
	 * Verify if an extension is registered.
	 * @param  {string}  extension The extension id.
	 * @return {Boolean}
	 */
	hasExtension (extension) {
		return typeof this.instOptions.extensions[extension] === 'object'
	}

	/**
	 * Get an extension object.
	 * @param  {string} plugin The extension id.
	 * @return {Object}        The extension object.
	 */
	getExtension (extension) {
		return this.instOptions.extensions[extension]
	}

	/**
	 * Call an extension callback
	 * @param  {string} id 		The extension id.
	 * @return {WebpackConfig} 	Instance.
	 */
	use (id) {
		var args = Array.prototype.slice.call(arguments, 1)
		if (this.hasExtension(id)) {
			var extension = this.getExtension(id)
			var options = this.extend(extension.options, args)
			extension.callback.apply(this, options)
		}
		return this
	}

	/**
	 * Create a dynamic instance of a plugin using it's constructor.
	 * @param  {?} constructor The plugin constructor.
	 * @return {?}             The plugin instance.
	 */
	createPlugin (constructor) {
		const args = Array.prototype.slice.call(arguments, 1)
		const object = Object.create(constructor.prototype)
		const result = constructor.apply(object, args)
		if (typeof result === 'object') {
			return result
		}
		return object
	}

	/**
	 * Verify whether global plugins are enabled and if a plugin is both registered enabled.
	 * @param  {string}  plugin The plugin id.
	 * @return {Boolean}
	 */
	hasPlugin (plugin) {
		return this.instOptions.plugins.enabled && 
			this.instOptions.plugins.plugin[plugin] && 
			this.instOptions.plugins.plugin[plugin].enabled
	}

	/**
	 * Get a plugin options object.
	 * @param  {string} plugin The plugins id.
	 * @return {Object}        The plugin options object.
	 */
	getPlugin (plugin) {
		return this.instOptions.plugins.plugin[plugin]
	}

	/**
	 * Remove a plugin by it's instance type
	 * @param  {?} plugin 			Plugin constructor
	 * @return {WebpackConfig}      Instance.
	 */
	removePlugin (plugin) {
		this.config.plugins = this.config.plugins.filter((p) => p instanceof plugin === false)
		return this
	}

	/**
	 * Enable all plugins.
	 * @return {WebpackConfig} Instance.
	 */
	withPlugins () {
		this.instOptions.plugins.enabled = true
		return this
	}

	/**
	 * Disable all plugins.
	 * @return {WebpackConfig} Instance.
	 */
	withoutPlugins () {
		this.instOptions.plugins.enabled = false
		return this
	}

	/**
	 * Add a plugin.
	 * @param  {string} id            	A unique identifier.
	 * @param  {?} plugin        		The plugin instance.
	 * @param  {Object} pluginOptions 	Arbitrary plugin options object.
	 * @return {WebpackConfig}        	Instance.
	 */
	withPlugin (id, plugin, pluginOptions) {
		var options = {
			plugins: {
				enabled: true,
				plugin: {}
			}
		}
		options.plugins.plugin[id] = {
			enabled: true,
			plugin: plugin,
			options: pluginOptions || {}
		}
		return this.options(options)
	}

	/**
	 * Get all matching loader objects.
	 * @param  {string} match 	The loader object to match.
	 * @param  {Object} obj     The object to search.
	 * @return {Array}         	An array of loader objects.
	 */
	getLoaders (match, obj) {
		return obj.module.loaders.map((loader, index) => {
			return {
				loader: loader,
				index: index
			}
		})
		.filter((loader) => {
			return loader.loader.loader.indexOf(match.loader) !== -1 && 
				String(loader.loader.test) === String(match.test)
		})
	}

	/**
	 * Get all matching loader objects by the test key or extension.
	 * @param  {string|RegExp} extension 	Extension or RegExp test (i.e. /\.js$/ or 'js').
	 * @param  {Object} obj       			The object to search.
	 * @return {Array}           			An array of loader objects.
	 */
	getLoadersByExtension (extension, obj) {
		const isRegExp = extension instanceof RegExp
		return obj.module.loaders.map((loader, index) => {
			return {
				loader: loader,
				index: index
			}
		})
		.filter((loader) => {
			return String(loader.loader.test) === String(isRegExp ? extension : new RegExp('\\.' + extension + '$'))
		})
	}

	/**
	 * Add a loader to webpack options.
	 * @param {Object} loader 	The loader object.
	 * @return {WebpackConfig} 	Instance.
	 */
	addLoader (loader) {
		this.removeLoaders(loader, this.instOptions.webpack)
		return this.webpack({
			module: {
				loaders: [
					loader
				]
			}
		})
	}

	/**
	 * Add multiple loader objects to webpack options.
	 * @param {Array} loaders 	An array of loader objects.
	 * @return {WebpackConfig} 	Instance.
	 */
	addLoaders (loaders) {
		loaders.map((loader) => {
			this.addLoader(loader)
		})
		return this
	}

	/**
	 * Remove all matching loader objects.
	 * @param  {string} match 	The loader object to match.
	 * @param  {Object} obj     The object to remove the loaders from.
	 * @return {WebpackConfig}  Instance.
	 */
	removeLoaders (match, obj) {
		this.getLoaders(match, obj).map((loader) => {
			obj.module.loaders.splice(loader.index, 1)
		})
		return this
	}

	/**
	 * Export the bundle as library.
	 * @param  {string} libraryName   	The library name.
	 * @param  {Object} outputOptions 	Extend or override output options.
	 * @return {WebpackConfig}			Instance.
	 */
	withLibrary (libraryName, outputOptions) {
		return this.webpack({
			output: extend({
				library: libraryName,
				libraryTarget: 'umd'
			}, outputOptions || {})
		})
	}

	/**
	 * Add a bundle entry.
	 * Supports multiple usage modes.
	 * ('name') 				=> name: 'index.js'
	 * ('path/name') 			=> name: 'path/name.js'
	 * ('name', 'path/file') 	=> name: 'path/file.js'
	 * @return {WebpackConfig} Instance.
	 */
	withEntry () {
		var args = Array.prototype.slice.call(arguments)
		if (!args.length) {
			return this
		}
		var entryName = args.shift()
		var entryNameIsFilepath = entryName.indexOf('.') !== -1
		var entryNameIsPath = entryName.indexOf('/') !== -1
		var entryPath = args

		if (!entryPath.length) {
			if (entryNameIsPath) {
				entryPath = entryName.split('/')
			}
			else if (entryNameIsFilepath) {
				entryPath = [entryName]
			}
			else {
				entryPath = ['index.js']
			}
		}

		var entryPathIsFilepath = entryPath.join('/').indexOf('.') !== -1

		if (entryNameIsPath) {
			entryName = entryPath[entryPath.length - 1]
		}
		if (entryNameIsFilepath) {
			entryName = entryName.split('.').shift()
		}
		if (!entryPathIsFilepath) {
			entryPath[entryPath.length - 1] += '.js'
		}

		var entry = {}
		entry[entryName] = this.srcPath.apply(this, entryPath)

		return this.webpack({
			entry: entry
		})
	}

	/**
	 * Remove entry
	 * @param  {string} name 	The entry name.
	 * @return {WebpackConfig} 	Instance.
	 */
	withoutEntry (name) {
		delete this.instOptions.webpack.entry[name]
		return this
	}

	/**
	 * Enables options specific to a standable library build and calls withEntry to add the bundle entry.
	 * @return {WebpackConfig} Instance.
	 */
	withStandaloneEntry () {
		var args = Array.prototype.slice.call(arguments)
		if (!args.length) {
			return this
		}
		let options = {}
		if (typeof args[arguments.length - 1] === 'object') {
			options = arguments.pop()
		}
		return this
			.options(extend({
				publicPath: false,
				outputPath: false
			}, options))
			.withEntry.apply(this, args)
	}

	/**
	 * Add a resolveLoader.alias
	 * @param  {?} alias 			Any supported webpack config alias type.
	 * @return {WebpackConfig}      Instance.
	 */
	withLoaderAlias (alias) {
		return this.webpack({
			resolveLoader: {
				alias: alias
			}
		})
	}

	/**
	 * Add a loader.alias
	 * @param  {?} alias 				Any supported webpack config alias type.
	 * @param {boolean} resolveLoader 	Also add to resolveLoader.alias.
	 * @return {WebpackConfig}      	Instance.
	 */
	withAlias (alias, resolveLoader) {
		if (resolveLoader !== false) {
			this.withLoaderAlias(alias)
		}
		return this.webpack({
			resolve: {
				alias: alias
			}
		})
	}

	/**
	 * Add a file extension to resolve.extensions and resolveLoader.extensions
	 * @param {String} extension 	The extension with or without a "." prefix.
	 * @return {WebpackConfig} 		Instance.
	 */
	addFileExtension (extension) {
		if (extension.indexOf('.') !== 0) {
			extension = '.' + extension
		}
		const extensions = {
			extensions: [ extension ]
		}
		return this.webpack({
			resolve: extensions,
			resolveLoader: extensions
		})
	}

	/**
	 * Call addExtension for every argument.
	 * @return {WebpackConfig} Instance.
	 */
	addFileExtensions () {
		var args = Array.prototype.slice.call(arguments)
		args.map((extension) => {
			this.addFileExtension(extension)
		})
		return this
	}

	/**
	 * Create or extend a config object.
	 * @param  {Object} options 	The object value.
	 * @return {WebpackConfig}      Instance.
	 */
	extendConfig (options) {
		this.config = extend(this.config || {}, options)
		return this
	}

	/**
	 * Get a webpack config object
	 * @return {Object}
	 */
	getConfig () {
		this.emit('config')
		this.extendConfig(this.instOptions.webpack)
		// output path
		var outputPath = [this.instOptions.distPath]
		if (this.instOptions.outputPath) {
			outputPath.push(this.instOptions.outputPath)
		}
		this.config.output.path = path.join(process.cwd(), path.join.apply(path, outputPath))
		// relative publicPath
		if (this.instOptions.publicPath) {
			this.config.output.publicPath = this.instOptions.outputPath + '/' 
		}
		if (this.instOptions.plugins.enabled) {
			forOwn(this.instOptions.plugins.plugin, (plugin, name, obj) => {
				if (!plugin.enabled) {
					return false
				}
				this.config.plugins.push(plugin.plugin)
			})
		}
		return this.config
	}

	/**
	 * Enable development mode.
	 * @param  {Object} options 	Extend or override webpack options.
	 * @return {WebpackConfig}      The instance.
	 */
	dev (options) {
		return this.webpack(extend({
			devtool: 'cheap-source-map',
			output: {
				pathInfo: true
			},
			debug: true,
			devServer: {
				contentBase: './' + this.instOptions.distPath,
				hot: true
			}
		}, options || {}))
	}

	/**
	 * Enable production mode.
	 * @param  {Object} options 	Extend or override webpack options.
	 * @return {WebpackConfig}      The instance.
	 */
	production (options) {
		return this.webpack(extend({
			plugins: [
				// short-circuits all warning code
				new webpack.DefinePlugin({
					"process.env": {
						"NODE_ENV": JSON.stringify("production")
					}
				}),
				new webpack.optimize.DedupePlugin(),
				// minify with dead-code elimination
				new webpack.optimize.UglifyJsPlugin({
					compress: {
						warnings: false
					},
					sourceMap: false
				}),
				// optimize module ids by occurence count
				new webpack.optimize.OccurenceOrderPlugin()
			]
		}, options || {}))
	}

}

export default WebpackConfig
module.exports = exports.default