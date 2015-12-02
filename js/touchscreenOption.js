function wait(ms) {
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve();
		}, ms);
	})
}

$.widget('iss.touchscreenOption', {
	options: {
		name: '',
		recording: false,
		touchDisplayRadius: 10
	},

	_create: function() {
		this._nameDiv = $('<div />').text(this.option('name'))
									.appendTo(this.element);
		this._bbox = getReplayBoundingBox(this.option('recording'));
		this._bbox.left -= this.option('touchDisplayRadius');
		this._bbox.top -= this.option('touchDisplayRadius');
		this._bbox.width += 2*this.option('touchDisplayRadius');
		this._bbox.height += 2*this.option('touchDisplayRadius');

		this.replayContainer = $('<div />').appendTo(this.element);

		this.snap = Snap('100%', '250px');
		$(this.snap.node).appendTo(this.replayContainer);

		this.replayContainer.touchscreen_layer({
			paper: this.snap
		});

		this.replayContainer.on('touchstart.usertouch touchend.usertouch touchcancel.usertouch', $.proxy(this._onTouchEvent, this));

		this._loopReplay();
		this._realTouches = [];
	},

	_destroy: function() {
	},

	_onTouchEvent: function(event) {
		var originalEvent = event.originalEvent;
		if(!originalEvent.simulated) { // simulated events are just part of the replay
			this._suspendReplay();
			this._realTouches = originalEvent.touches;
			originalEvent.preventDefault();
		}
	},

	_suspendReplay: function() {
		if(this._currentReplay) {
			this._currentReplay.stop();
			delete this._currentReplay;
		}
	},

	_loopReplay: function() {
		return wait(500).then(_.bind(function() {
			if(!this._isPaused()) {
				return this._replayTouches();
			}
		}, this)).then(_.bind(function() {
			delete this._currentReplay;
			return wait(this._isPaused() ? 3000  : 500);
		}, this)).then(_.bind(function() {
			this._loopReplay();
		}, this));
	},

	_isPaused: function() {
		return this._realTouches.length > 0;
	},

	_replayTouches: function() {
		var width = this.element.width(),
			height = this.element.height();

		return this._currentReplay = replayTouches(this.option('recording'), {
			target: this.replayContainer[0],
			scaleX: width/this._bbox.width,
			scaleY: height/this._bbox.height,
			offsetX: -this._bbox.left,
			offsetY: -this._bbox.top
		});
	}
});