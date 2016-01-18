import _ from 'lodash'

function customizer (x, y) {
	if (!_.isArray(x) && !_.isArray(y)) {
		return undefined;
	}
	x = (_.isArray(x) || _.isString(x))? x : (_.isUndefined(x) ? [] : [x]);
	y = (_.isArray(y) || _.isString(y))? y : (_.isUndefined(y) ? [] : [y]);
	return _.union(x, y);
}

function extend () {
	var args = Array.prototype.slice.call(arguments)
	return _.mergeWith.apply(_.mergeWith, args.concat(customizer))
}

export default function () {
	var args = Array.prototype.slice.call(arguments)
	args[0] = _.cloneDeep(args[0])
	return extend.apply(extend, args)
}