'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _extend2 = require('./extend.js');

var _extend3 = _interopRequireDefault(_extend2);

var _webpackQueryString = require('webpack-query-string');

var _webpackQueryString2 = _interopRequireDefault(_webpackQueryString);

var _defaultOptions = require('./default-options');

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _forOwn = require('lodash/forOwn');

var _forOwn2 = _interopRequireDefault(_forOwn);

var _requireLinkedPeer = require('require-linked-peer');

var _requireLinkedPeer2 = _interopRequireDefault(_requireLinkedPeer);

var _events = require('events');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var webpack = (0, _requireLinkedPeer2.default)('webpack');

// requiring module __dirname
var dirname = _path2.default.dirname(module.parent.filename);

var WebpackConfig = function (_EventEmitter) {
	_inherits(WebpackConfig, _EventEmitter);

	/**
  * Construct WebpackConfig.
  * @param  {Object} options Use options.
  */

	function WebpackConfig(options) {
		_classCallCheck(this, WebpackConfig);

		// apply default options

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WebpackConfig).call(this));

		_this.withDefaultOptions();

		// load user options
		_this.loadOptions();

		if (options) {
			_this.options(options);
		}
		return _this;
	}

	/**
  * Extend options
  * @param  {Object} options 	The options to apply.
  * @param  {boolean} reset   	Reset the options instead of extending.
  * @return {WebpackConfig}      Instance.
  */

	_createClass(WebpackConfig, [{
		key: 'options',
		value: function options(_options, reset) {
			_options = _lodash2.default.cloneDeep(_options);
			this.instOptions = reset ? _options : (0, _extend3.default)(this.instOptions || {}, _options);
			return this;
		}

		/**
   * Load user options from a file within the requiring module dirname.
   * @param  {String} filename  	The filename.
   * @return {WebpackConfig}      Instance.
   */

	}, {
		key: 'loadOptions',
		value: function loadOptions() {
			var filename = arguments.length <= 0 || arguments[0] === undefined ? 'base.config.js' : arguments[0];

			var configPath = _path2.default.resolve(dirname, filename);
			if (_fs2.default.existsSync(configPath)) {
				this.options(require(configPath));
			}
			return this;
		}

		/**
   * Reset to default options.
   * @return {WebpackConfig} Instance.
   */

	}, {
		key: 'withDefaultOptions',
		value: function withDefaultOptions() {
			return this.options(_defaultOptions2.default, true);
		}

		/**
   * Expose webpack-query-string utility.
   * Create a webpack friendly query string from input object.
   * @return {String} A query string.
   */

	}, {
		key: 'qs',
		value: function qs() {
			return _webpackQueryString2.default.apply(_webpackQueryString2.default, arguments);
		}

		/**
   * Expose extend utility.
   * Recursively extends objects and arrays using a union merge strategy.
   * @return {Object} The extended object.
   */

	}, {
		key: 'extend',
		value: function extend() {
			return _extend3.default.apply(_extend3.default, arguments);
		}

		/**
   * Resolve a path within options.srcPath
   * @return {String} The resolved path.
   */

	}, {
		key: 'srcPath',
		value: function srcPath() {
			var paths = Array.prototype.slice.call(arguments, 0);
			paths.unshift(this.instOptions.srcPath);
			return _path2.default.resolve(process.cwd(), _path2.default.join.apply(_path2.default, paths));
		}

		/**
   * Extend options.webpack
   * @param  {Object} options 	The options
   * @param  {boolean} reset   	Replace instead of extend.
   * @return {WebpackConfig}      Instance.
   */

	}, {
		key: 'webpack',
		value: function webpack(options, reset) {
			this.instOptions.webpack = reset ? options : (0, _extend3.default)(this.instOptions.webpack || {}, options);
			return this;
		}

		/**
   * Register an extension
   * @param  {string} id 			The extension id.
   * @param  {string} extension 	The extension callback.
   * @return {WebpackConfig} 		Instance.
   */

	}, {
		key: 'register',
		value: function register(id, extension) {
			var args = Array.prototype.slice.call(arguments, 2);
			var extensions = {
				extensions: {}
			};
			extensions.extensions[id] = {
				callback: extension,
				options: args
			};
			return this.options(extensions);
		}

		/**
   * Verify if an extension is registered.
   * @param  {string}  extension The extension id.
   * @return {Boolean}
   */

	}, {
		key: 'hasExtension',
		value: function hasExtension(extension) {
			return _typeof(this.instOptions.extensions[extension]) === 'object';
		}

		/**
   * Get an extension object.
   * @param  {string} plugin The extension id.
   * @return {Object}        The extension object.
   */

	}, {
		key: 'getExtension',
		value: function getExtension(extension) {
			return this.instOptions.extensions[extension];
		}

		/**
   * Call an extension callback
   * @param  {string} id 		The extension id.
   * @return {WebpackConfig} 	Instance.
   */

	}, {
		key: 'use',
		value: function use(id) {
			var args = Array.prototype.slice.call(arguments, 1);
			if (this.hasExtension(id)) {
				var extension = this.getExtension(id);
				var options = this.extend(extension.options, args);
				extension.callback.apply(this, options);
			}
			return this;
		}

		/**
   * Create a dynamic instance of a plugin using it's constructor.
   * @param  {?} constructor The plugin constructor.
   * @return {?}             The plugin instance.
   */

	}, {
		key: 'createPlugin',
		value: function createPlugin(constructor) {
			var args = Array.prototype.slice.call(arguments, 1);
			var object = Object.create(constructor.prototype);
			var result = constructor.apply(object, args);
			if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {
				return result;
			}
			return object;
		}

		/**
   * Verify whether global plugins are enabled and if a plugin is both registered enabled.
   * @param  {string}  plugin The plugin id.
   * @return {Boolean}
   */

	}, {
		key: 'hasPlugin',
		value: function hasPlugin(plugin) {
			return this.instOptions.plugins.enabled && this.instOptions.plugins.plugin[plugin] && this.instOptions.plugins.plugin[plugin].enabled;
		}

		/**
   * Get a plugin options object.
   * @param  {string} plugin The plugins id.
   * @return {Object}        The plugin options object.
   */

	}, {
		key: 'getPlugin',
		value: function getPlugin(plugin) {
			return this.instOptions.plugins.plugin[plugin];
		}

		/**
   * Remove a plugin by it's instance type
   * @param  {?} plugin 			Plugin constructor
   * @return {WebpackConfig}      Instance.
   */

	}, {
		key: 'removePlugin',
		value: function removePlugin(plugin) {
			this.config.plugins = this.config.plugins.filter(function (p) {
				return p instanceof plugin === false;
			});
			return this;
		}

		/**
   * Enable all plugins.
   * @return {WebpackConfig} Instance.
   */

	}, {
		key: 'withPlugins',
		value: function withPlugins() {
			this.instOptions.plugins.enabled = true;
			return this;
		}

		/**
   * Disable all plugins.
   * @return {WebpackConfig} Instance.
   */

	}, {
		key: 'withoutPlugins',
		value: function withoutPlugins() {
			this.instOptions.plugins.enabled = false;
			return this;
		}

		/**
   * Add a plugin.
   * @param  {string} id            	A unique identifier.
   * @param  {?} plugin        		The plugin instance.
   * @param  {Object} pluginOptions 	Arbitrary plugin options object.
   * @return {WebpackConfig}        	Instance.
   */

	}, {
		key: 'withPlugin',
		value: function withPlugin(id, plugin, pluginOptions) {
			var options = {
				plugins: {
					enabled: true,
					plugin: {}
				}
			};
			options.plugins.plugin[id] = {
				enabled: true,
				plugin: plugin,
				options: pluginOptions || {}
			};
			return this.options(options);
		}

		/**
   * Get all matching loader objects.
   * @param  {string} match 	The loader object to match.
   * @param  {Object} obj     The object to search.
   * @return {Array}         	An array of loader objects.
   */

	}, {
		key: 'getLoaders',
		value: function getLoaders(match, obj) {
			return obj.module.loaders.map(function (loader, index) {
				return {
					loader: loader,
					index: index
				};
			}).filter(function (loader) {
				return loader.loader.loader.indexOf(match.loader) !== -1 && String(loader.loader.test) === String(match.test);
			});
		}

		/**
   * Get all matching loader objects by the test key or extension.
   * @param  {string|RegExp} extension 	Extension or RegExp test (i.e. /\.js$/ or 'js').
   * @param  {Object} obj       			The object to search.
   * @return {Array}           			An array of loader objects.
   */

	}, {
		key: 'getLoadersByExtension',
		value: function getLoadersByExtension(extension, obj) {
			var isRegExp = extension instanceof RegExp;
			return obj.module.loaders.map(function (loader, index) {
				return {
					loader: loader,
					index: index
				};
			}).filter(function (loader) {
				return String(loader.loader.test) === String(isRegExp ? extension : new RegExp('\\.' + extension + '$'));
			});
		}

		/**
   * Add a loader to webpack options.
   * @param {Object} loader 	The loader object.
   * @return {WebpackConfig} 	Instance.
   */

	}, {
		key: 'addLoader',
		value: function addLoader(loader) {
			this.removeLoaders(loader, this.instOptions.webpack);
			return this.webpack({
				module: {
					loaders: [loader]
				}
			});
		}

		/**
   * Add multiple loader objects to webpack options.
   * @param {Array} loaders 	An array of loader objects.
   * @return {WebpackConfig} 	Instance.
   */

	}, {
		key: 'addLoaders',
		value: function addLoaders(loaders) {
			var _this2 = this;

			loaders.map(function (loader) {
				_this2.addLoader(loader);
			});
			return this;
		}

		/**
   * Remove all matching loader objects.
   * @param  {string} match 	The loader object to match.
   * @param  {Object} obj     The object to remove the loaders from.
   * @return {WebpackConfig}  Instance.
   */

	}, {
		key: 'removeLoaders',
		value: function removeLoaders(match, obj) {
			this.getLoaders(match, obj).map(function (loader) {
				obj.module.loaders.splice(loader.index, 1);
			});
			return this;
		}

		/**
   * Export the bundle as library.
   * @param  {string} libraryName   	The library name.
   * @param  {Object} outputOptions 	Extend or override output options.
   * @return {WebpackConfig}			Instance.
   */

	}, {
		key: 'withLibrary',
		value: function withLibrary(libraryName, outputOptions) {
			return this.webpack({
				output: (0, _extend3.default)({
					library: libraryName,
					libraryTarget: 'umd'
				}, outputOptions || {})
			});
		}

		/**
   * Add a bundle entry.
   * Supports multiple usage modes.
   * ('name') 				=> name: 'index.js'
   * ('path/name') 			=> name: 'path/name.js'
   * ('name', 'path/file') 	=> name: 'path/file.js'
   * @return {WebpackConfig} Instance.
   */

	}, {
		key: 'withEntry',
		value: function withEntry() {
			var args = Array.prototype.slice.call(arguments);
			if (!args.length) {
				return this;
			}
			var entryName = args.shift();
			var entryNameIsFilepath = entryName.indexOf('.') !== -1;
			var entryNameIsPath = entryName.indexOf('/') !== -1;
			var entryPath = args;

			if (!entryPath.length) {
				if (entryNameIsPath) {
					entryPath = entryName.split('/');
				} else if (entryNameIsFilepath) {
					entryPath = [entryName];
				} else {
					entryPath = ['index.js'];
				}
			}

			var entryPathIsFilepath = entryPath.join('/').indexOf('.') !== -1;

			if (entryNameIsPath) {
				entryName = entryPath[entryPath.length - 1];
			}
			if (entryNameIsFilepath) {
				entryName = entryName.split('.').shift();
			}
			if (!entryPathIsFilepath) {
				entryPath[entryPath.length - 1] += '.js';
			}

			var entry = {};
			entry[entryName] = this.srcPath.apply(this, entryPath);

			return this.webpack({
				entry: entry
			});
		}

		/**
   * Remove entry
   * @param  {string} name 	The entry name.
   * @return {WebpackConfig} 	Instance.
   */

	}, {
		key: 'withoutEntry',
		value: function withoutEntry(name) {
			delete this.instOptions.webpack.entry[name];
			return this;
		}

		/**
   * Enables options specific to a standable library build and calls withEntry to add the bundle entry.
   * @return {WebpackConfig} Instance.
   */

	}, {
		key: 'withStandaloneEntry',
		value: function withStandaloneEntry() {
			var args = Array.prototype.slice.call(arguments);
			if (!args.length) {
				return this;
			}
			var options = {};
			if (_typeof(args[arguments.length - 1]) === 'object') {
				options = arguments.pop();
			}
			return this.options((0, _extend3.default)({
				publicPath: false,
				outputPath: false
			}, options)).withEntry.apply(this, args);
		}

		/**
   * Add a resolveLoader.alias
   * @param  {?} alias 			Any supported webpack config alias type.
   * @return {WebpackConfig}      Instance.
   */

	}, {
		key: 'withLoaderAlias',
		value: function withLoaderAlias(alias) {
			return this.webpack({
				resolveLoader: {
					alias: alias
				}
			});
		}

		/**
   * Add a loader.alias
   * @param  {?} alias 				Any supported webpack config alias type.
   * @param {boolean} resolveLoader 	Also add to resolveLoader.alias.
   * @return {WebpackConfig}      	Instance.
   */

	}, {
		key: 'withAlias',
		value: function withAlias(alias, resolveLoader) {
			if (resolveLoader !== false) {
				this.withLoaderAlias(alias);
			}
			return this.webpack({
				resolve: {
					alias: alias
				}
			});
		}

		/**
   * Add a file extension to resolve.extensions and resolveLoader.extensions
   * @param {String} extension 	The extension with or without a "." prefix.
   * @return {WebpackConfig} 		Instance.
   */

	}, {
		key: 'addFileExtension',
		value: function addFileExtension(extension) {
			if (extension.indexOf('.') !== 0) {
				extension = '.' + extension;
			}
			var extensions = {
				extensions: [extension]
			};
			return this.webpack({
				resolve: extensions,
				resolveLoader: extensions
			});
		}

		/**
   * Call addExtension for every argument.
   * @return {WebpackConfig} Instance.
   */

	}, {
		key: 'addFileExtensions',
		value: function addFileExtensions() {
			var _this3 = this;

			var args = Array.prototype.slice.call(arguments);
			args.map(function (extension) {
				_this3.addFileExtension(extension);
			});
			return this;
		}

		/**
   * Create or extend a config object.
   * @param  {Object} options 	The object value.
   * @return {WebpackConfig}      Instance.
   */

	}, {
		key: 'extendConfig',
		value: function extendConfig(options) {
			this.config = (0, _extend3.default)(this.config || {}, options);
			return this;
		}

		/**
   * Get a webpack config object
   * @return {Object}
   */

	}, {
		key: 'getConfig',
		value: function getConfig() {
			var _this4 = this;

			this.emit('config');
			this.extendConfig(this.instOptions.webpack);
			// output path
			var outputPath = [this.instOptions.distPath];
			if (this.instOptions.outputPath) {
				outputPath.push(this.instOptions.outputPath);
			}
			this.config.output.path = _path2.default.join(process.cwd(), _path2.default.join.apply(_path2.default, outputPath));
			// relative publicPath
			if (this.instOptions.publicPath) {
				this.config.output.publicPath = this.instOptions.outputPath + '/';
			}
			if (this.instOptions.plugins.enabled) {
				(0, _forOwn2.default)(this.instOptions.plugins.plugin, function (plugin, name, obj) {
					if (!plugin.enabled) {
						return false;
					}
					_this4.config.plugins.push(plugin.plugin);
				});
			}
			return this.config;
		}

		/**
   * Enable development mode.
   * @param  {Object} options 	Extend or override webpack options.
   * @return {WebpackConfig}      The instance.
   */

	}, {
		key: 'dev',
		value: function dev(options) {
			return this.webpack((0, _extend3.default)({
				devtool: 'cheap-source-map',
				output: {
					pathInfo: true
				},
				debug: true,
				devServer: {
					contentBase: './' + this.instOptions.distPath,
					hot: true
				}
			}, options || {}));
		}

		/**
   * Enable production mode.
   * @param  {Object} options 	Extend or override webpack options.
   * @return {WebpackConfig}      The instance.
   */

	}, {
		key: 'production',
		value: function production(options) {
			return this.webpack((0, _extend3.default)({
				plugins: [
				// short-circuits all warning code
				new webpack.DefinePlugin({
					"process.env": {
						"NODE_ENV": JSON.stringify("production")
					}
				}), new webpack.optimize.DedupePlugin(),
				// minify with dead-code elimination
				new webpack.optimize.UglifyJsPlugin({
					compress: {
						warnings: false
					},
					sourceMap: false
				}),
				// optimize module ids by occurence count
				new webpack.optimize.OccurenceOrderPlugin()]
			}, options || {}));
		}
	}]);

	return WebpackConfig;
}(_events.EventEmitter);

exports.default = WebpackConfig;

module.exports = exports.default;