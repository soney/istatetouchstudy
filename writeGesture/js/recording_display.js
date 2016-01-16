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
	},

	_destroy: function() {
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