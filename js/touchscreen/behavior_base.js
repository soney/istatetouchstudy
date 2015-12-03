(function(root) {
	var behaviors = {};
	root.registerBehavior = function(name, func) {
		behaviors[name] = func;
	};
	root.getBehavior = function(name) {
		return behaviors[name];
	};
}(this));
