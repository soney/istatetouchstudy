$.widget('iss.recordingDisplay', {
	options: {
		name: '',
		recording: false,
		implementation: 'control'
	},

	_create: function() {
		this.element.touchscreenOption({
			showPaths: true
		});

		this.$onPathCreated = $.proxy(this._onPathCreated, this)
		this.$onPathDestroyed = $.proxy(this._onPathDestroyed, this)

		pathList.on('pathCreated', this.$onPathCreated);
		pathList.on('pathDestroyed', this.$onPathDestroye);
		_.each(pathList.paths, function(path) {
			this._onPathCreated(path);
		}, this);
		this._currentPaths = [];
	},

	_destroy: function() {
	},

	_onPathCreated: function(path) {
		this._currentPaths.push(path);
	},
	_onPathDestroyed: function(path) {
		this._currentPaths = _.without(this._currentPaths, path);
	},

	destroyPaths: function() {
		_.each(this._currentPaths, function(path) {
			//console.log('destroy', path);
			//path.destroy();
		});
		this._currentPaths = [];
	},

	_setOption: function(key, value) {
		this._super(key, value);

		if(key === 'name') {
			this.element.touchscreenOption('option', key, value);
		} else if(key === 'recording') {
			this.element.touchscreenOption('option', key, value);
		} else if(key === 'implementation') {
			this.element.touchscreenOption('option', key, value);
		}
	}

});