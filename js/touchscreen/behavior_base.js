(function(root) {
	var behaviors = {};
	root.registerBehavior = function(name, func) {
		behaviors[name] = func;
	};
}(this));
