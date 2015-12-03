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

		this.replayContainer.on('touchstart.usertouch touchend.usertouch touchcancel.usertouch touchmove.usertouch', $.proxy(this._onTouchEvent, this));

		this._loopReplay();
		this._realTouches = [];

		this.behaviorFunc = getBehavior(this.option('name'));

		this.$onTouchStart = _.bind(this._onTouchStart, this);
		this.$onTouchMove = _.bind(this._onTouchMove, this);
		this.$onTouchEnd = _.bind(this._onTouchEnd, this);
		this.$onTouchCancel = _.bind(this._onTouchCancel, this);
		this.$onGestureStart = _.bind(this._onGestureStart, this);
		this.$onGestureFire = _.bind(this._onGestureFire, this);
		this.$onGestureUpdate = _.bind(this._onGestureUpdate, this);
		this.$onGestureStop = _.bind(this._onGestureStop, this);

		this.behaviorFunc(this.$onTouchStart, this.$onTouchMove, this.$onTouchEnd,
			this.$onTouchCancel, this.$onGestureFire, this.$onGestureStart,
			this.$onGestureUpdate, this.$onGestureStop);
		this.element.hover(_.bind(function() {
			$('.touchscreen_option').not(this.element).touchscreenOption('pause');
		}, this), _.bind(function() {
			$('.touchscreen_option').not(this.element).touchscreenOption('resume');
		}, this));
		this.element.addClass('touchscreen_option');
		this._paused = false;
	},

	_destroy: function() {
		this.replayContainer.off('touchstart.usertouch touchend.usertouch touchcancel.usertouch touchmove.usertouch');
	},

	_onTouchStart: function(func) {
		$(this.element).on('touchstart', func);
	},

	_onTouchMove: function(func) {
		$(this.element).on('touchmove', func);
	},

	_onTouchEnd: function(func) {
		$(this.element).on('touchend', func);
	},

	_onTouchCancel: function(func) {
		$(this.element).on('touchcancel', func);
	},

	_onGestureStart: function(val) {
		var width = $(this.snap.node).width();

		if(this.activatedText) {
			this.activatedText.remove();
			delete this.activatedText;
		}

		var activatedText = this.snap.text(width/2, 50, 'Activated').attr({
			fill: '#FFF'
		}).animate({
			opacity: 0
		}, 2000, mina.easeinout, _.bind(function() {
			fireText.remove();
		}, this));

		this.activatedText = activatedText;
	},
	_onGestureFire: function(val) {
		var width = $(this.snap.node).width();

		var fireText = this.snap.text(width/2, 50, 'Fire!').attr({
			fill: '#FFF'
		}).animate({
			opacity: 0
		}, 2000, mina.easeinout, _.bind(function() {
			fireText.remove();
		}, this))
	},
	_onGestureUpdate: function(val) {
		if(this.activatedText) {
			this.activatedText.attr({
				text: 'value: ' + val
			});
		}
	},
	_onGestureStop: function() {
		if(this.activatedText) {
			this.activatedText.remove();
			delete this.activatedText;
		}
		var activatedText = this.activatedText;
		activatedText.animate({
			opacity: 0
		}, 2000, mina.easeinout, function() {
			activatedText.remove();
		});
	},



	_onTouchEvent: function(event) {
		var originalEvent = event.originalEvent;
		if(!originalEvent.simulated) { // simulated events are just part of the replay
			this._suspendReplay();

			if(originalEvent.touches.length > 0) {
				this.pause();
			} else {
				this.resume();
			}
			originalEvent.preventDefault();
		}

	},

	pause: function() {
		this._suspendReplay();
		this._paused = true;
	},

	resume: function() {
		this._paused = false;
	},

	_suspendReplay: function() {
		if(this._currentReplay) {
			this._currentReplay.stop();
			delete this._currentReplay;
			this.replayContainer.touchscreen_layer('clear');
		}
	},

	_loopReplay: function() {
		return wait(500).then(_.bind(function() {
			if(!this._isPaused()) {
				return this._replayTouches();
			}
		}, this)).then(_.bind(function() {
			delete this._currentReplay;
			return wait(this._isPaused() ? 1000  : 500);
		}, this)).then(_.bind(function() {
			this._loopReplay();
		}, this));
	},

	_isPaused: function() {
		return this._paused;
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