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
		this._currentReplayID = 1;
		this._nameDiv = $('<div />').text(this.option('name'))
									.appendTo(this.element);
		this.replayContainer = $('<div />').appendTo(this.element);

		this.snap = Snap('100%', '250px');
		$(this.snap.node).appendTo(this.replayContainer);

		this.replayContainer.touchscreen_layer({
			paper: this.snap
		});

		this.replayContainer.on('touchstart.usertouch touchend.usertouch touchcancel.usertouch touchmove.usertouch', $.proxy(this._onTouchEvent, this));

		this._realTouches = [];

		this.element.hover(_.bind(function() {
			$('.touchscreen_option').not(this.element).touchscreenOption('pause');
		}, this), _.bind(function() {
			$('.touchscreen_option').not(this.element).touchscreenOption('resume');
		}, this));
		this.element.addClass('touchscreen_option');
		this._paused = false;

		this.option({
			recording: this.option('recording'),
			name: this.option('name')
		});
		this._loopReplay();
	},

	_destroy: function() {
		this.replayContainer.off('touchstart.usertouch touchend.usertouch touchcancel.usertouch touchmove.usertouch');
	},

	_bindFunctions: function() {
		this._currentReplayID++;
		this.$onTouchStart = _.bind(this._onTouchStart, this, this._currentReplayID);
		this.$onTouchMove = _.bind(this._onTouchMove, this, this._currentReplayID);
		this.$onTouchEnd = _.bind(this._onTouchEnd, this, this._currentReplayID);
		this.$onTouchCancel = _.bind(this._onTouchCancel, this, this._currentReplayID);
		this.$offTouchStart = _.bind(this._offTouchStart, this, this._currentReplayID);
		this.$offTouchMove = _.bind(this._offTouchMove, this, this._currentReplayID);
		this.$offTouchEnd = _.bind(this._offTouchEnd, this, this._currentReplayID);
		this.$offTouchCancel = _.bind(this._offTouchCancel, this, this._currentReplayID);
		this.$onGestureFire = _.bind(this._onGestureFire, this, this._currentReplayID);
		this.$onGestureStart = _.bind(this._onGestureStart, this, this._currentReplayID);
		this.$onGestureUpdate = _.bind(this._onGestureUpdate, this, this._currentReplayID);
		this.$onGestureStop = _.bind(this._onGestureStop, this, this._currentReplayID);

	},

	_setOption: function(key, value) {
		var oldValue = this.option(key);
		this._super(key, value);

		if(key === 'recording') {
			this._suspendReplay();
			if(value) {
				this._bbox = getReplayBoundingBox(this.option('recording'));
				this._bbox.left -= this.option('touchDisplayRadius');
				this._bbox.top -= this.option('touchDisplayRadius');
				this._bbox.width += 2*this.option('touchDisplayRadius');
				this._bbox.height += 2*this.option('touchDisplayRadius');
			}
		} else if(key === 'name') {
			if(value) {
				this._bindFunctions();
				this.behaviorFunc = getBehavior(value);
				this.behaviorFunc(this.$onTouchStart, this.$onTouchMove, this.$onTouchEnd, this.$onTouchCancel,
					this.$offTouchStart, this.$offTouchMove, this.$offTouchEnd, this.$offTouchCancel,
					this.$onGestureFire, this.$onGestureStart, this.$onGestureUpdate, this.$onGestureStop);
			}
		}
	},

	_onTouchStart: function(rid, func) {
		if(rid === this._currentReplayID) {
			$(this.element).on('touchstart', func);
		}
	},

	_onTouchMove: function(rid, func) {
		if(rid === this._currentReplayID) {
			$(this.element).on('touchmove', func);
		}
	},

	_onTouchEnd: function(rid, func) {
		if(rid === this._currentReplayID) {
			$(this.element).on('touchend', func);
		}
	},

	_onTouchCancel: function(rid, func) {
		if(rid === this._currentReplayID) {
			$(this.element).on('touchcancel', func);
		}
	},

	_offTouchStart: function(rid, func) {
		if(rid === this._currentReplayID) {
			$(this.element).off('touchstart', func);
		}
	},

	_offTouchMove: function(rid, func) {
		if(rid === this._currentReplayID) {
			$(this.element).off('touchmove', func);
		}
	},

	_offTouchEnd: function(rid, func) {
		if(rid === this._currentReplayID) {
			$(this.element).off('touchend', func);
		}
	},

	_offTouchCancel: function(rid, func) {
		if(rid === this._currentReplayID) {
			$(this.element).off('touchcancel', func);
		}
	},

	_onGestureStart: function(rid, val) {
		if(rid === this._currentReplayID) {
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
		}
	},
	_onGestureFire: function(rid, val) {
		if(rid === this._currentReplayID) {
			var width = $(this.snap.node).width();

			var fireText = this.snap.text(width/2, 50, 'Fire!').attr({
				fill: '#FFF'
			}).animate({
				opacity: 0
			}, 2000, mina.easeinout, _.bind(function() {
				fireText.remove();
			}, this));
		}
	},
	_onGestureUpdate: function(rid, val) {
		if(rid === this._currentReplayID) {
			if(this.activatedText) {
				this.activatedText.attr({
					text: 'value: ' + val
				});
			}
		}
	},
	_onGestureStop: function(rid) {
		if(rid === this._currentReplayID) {
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
		}
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
		this._paused = true;
		this._suspendReplay();
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
		var resolvePause;
		this._pausePromise = new Promise(_.bind(function(resolve, reject) {
			resolvePause = resolve;
		}, this));

		var width = this.element.width(),
			height = this.element.height();

		var replayPromise = replayTouches(this.option('recording'), {
			target: this.replayContainer[0],
			scaleX: width/this._bbox.width,
			scaleY: height/this._bbox.height,
			offsetX: -this._bbox.left,
			offsetY: -this._bbox.top
		});

		var rv = Promise.race([replayPromise, this._pausePromise]);

		rv.stop = function() {
			replayPromise.stop();
			resolvePause();
		};
		this._currentReplay = rv;

		return rv;
	}
});