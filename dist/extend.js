'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var args = Array.prototype.slice.call(arguments);
	args[0] = _lodash2.default.cloneDeep(args[0]);
	return extend.apply(extend, args);
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function customizer(x, y) {
	if (!_lodash2.default.isArray(x) && !_lodash2.default.isArray(y)) {
		return undefined;
	}
	x = _lodash2.default.isArray(x) || _lodash2.default.isString(x) ? x : _lodash2.default.isUndefined(x) ? [] : [x];
	y = _lodash2.default.isArray(y) || _lodash2.default.isString(y) ? y : _lodash2.default.isUndefined(y) ? [] : [y];
	return _lodash2.default.union(x, y);
}

function extend() {
	var args = Array.prototype.slice.call(arguments);
	return _lodash2.default.mergeWith.apply(_lodash2.default.mergeWith, args.concat(customizer));
}