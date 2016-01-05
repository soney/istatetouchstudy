$.widget('iss.gestureAuthor', {
	options: {
		headerText: 'registerBehavior("$NAME", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {\n\n',
		footerText: '\n\n});',
		headerRegex: /registerBehavior\("([a-zA-Z0-9_\s]+)", function\(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end\) {\n\n/,
		footerRegex: /\n\n}\);/
	},

	_create: function() {
		var JavaScriptMode = ace.require("ace/mode/javascript").Mode;

		this.editor = ace.edit('editor');
		this.editor.session.setMode(new JavaScriptMode());

		this.recordingDisplay = $('#replay').recordingDisplay();

		var editorStatus = $('#editorStatus');
		editorStatus.addClass('text-warning').text('...');
		this._updateGestureList().then($.proxy(function() {
			this._updateRecordingList();

			var throttledSave = _.debounce(_.bind(function() {
				this.save();
				this.refreshGesture();
			}, this), 2000);

			this.editor.getSession().on('change', $.proxy(function() {
				editorStatus.removeClass('text-success').addClass('text-warning').text('...');
				throttledSave();
			}, this));

			$('#behaviors').on('change', $.proxy(function(event) {
				var behaviorName = $(event.target).val();
				this.openGesture(behaviorName);
				$('#recordings').val(behaviorName);
				this.openRecording(behaviorName);
			}, this));
			$('#recordings').on('change', $.proxy(function(event) {
				this.openRecording($(event.target).val());
			}, this));
		}, this));

		$(window).on('resize', $.proxy(this._onResize, this));
		this._onResize();
	},

	_onResize: function() {
		$('html').height($(window).height())
	},

	save: function() {
		var contents = this._getCurrentGesture(),
			editorStatus = $('#editorStatus'),
			gestureName = this.currentGestureName;

		editorStatus.text('Saving ' + gestureName);
		setBehavior(this.currentGestureName, contents).then(function() {
			editorStatus.addClass('text-success').removeClass('text-warning').text('Saved "' + gestureName + '"');
		}, function(err) {

		});
	},

	refreshGesture: function() {
		var contents = this._getCurrentGesture();
		try {
			eval(contents);
			this.recordingDisplay.recordingDisplay('option', 'name', this.currentGestureName);
		} catch(e) {
			console.error(e.stack);
		}
	},

	openGesture: function(gestureName) {
		getBehaviorCode(gestureName).then($.proxy(function(contents) {
			this.currentGestureName = gestureName;
			var headerRegex = this.option('headerRegex'),
				footerRegex = this.option('footerRegex');

			var strippedContents = contents	.replace(headerRegex, '')
											.replace(footerRegex, '');

			this.editor.setValue(strippedContents, -1);
		}, this));
	},

	openRecording: function(recordingName) {
		getRecording(recordingName).then($.proxy(function(contents) {
			this.recordingDisplay.recordingDisplay('option', 'recording', contents);
		}, this));
	},

	_getCurrentGesture: function() {
		return this.option('headerText').replace('$NAME', this.currentGestureName) +
						this.editor.getSession().getValue() +
						this.option('footerText');
	},
	/*
	editor.getSession().on('change', function () {
	  editor.getSession().getValue();
  });
  */

	_updateGestureList: function() {
		var behaviorsElement = $('#behaviors');
		return getBehaviors().then($.proxy(function(behaviors) {
			behaviors.forEach(function(behavior) {
				$('<option />', {
					text: behavior.replace(/_/gi, ''),
					attr: {
						value: behavior
					}
				}).appendTo(behaviorsElement);
			});
			return this.openGesture(behaviors[0]);
		}, this));
	},

	_updateRecordingList: function() {
		var recordingsElement = $('#recordings');
		getRecordings().then($.proxy(function(recordings) {
			recordings.forEach(function(recording) {
				$('<option />', {
					text: recording.replace(/_/gi, ''),
					attr: {
						value: recording
					}
				}).appendTo(recordingsElement);
			});
			return this.openRecording(recordings[0]);
		}, this));
	},

	_destroy: function() {
		this.editor.destroy();
	}
});