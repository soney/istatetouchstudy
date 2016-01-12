$.widget('iss.gestureAuthor', {
	options: {
		conditions: ['control', 'primitives'],

		controlHeaderText: 'registerBehavior("$NAME", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {\n\n',
		controlFooterText: '\n\n});',
		controlHeaderRegex: /registerBehavior\("([a-zA-Z0-9_\s]+)", "control", function\(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end\) {\n\n/,
		controlFooterRegex: /\n\n}\);/,
		controlAvailableMethods: ['onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel', 'offTouchStart', 'offTouchMove', 'offTouchEnd', 'offTouchCancel', 'fire', 'begin', 'update', 'end', 'setTimeout', 'clearTimeout'],

		primitivesHeaderText: 'registerBehavior("$NAME", "primitives", function(TouchCluster, Path, fire, begin, update, end) {\n\n',
		primitivesFooterText: '\n\n});',
		primitivesHeaderRegex: /registerBehavior\("([a-zA-Z0-9_\s]+)", "primitives", function\(TouchCluster, Path, fire, begin, update, end\) {\n\n/,
		primitivesFooterRegex: /\n\n}\);/,
		primitivesAvailableMethods: ['TouchCluster', 'Path', 'fire', 'begin', 'update', 'end', 'setTimeout', 'clearTimeout'],

		currentCondition: 'control',
		currentGestureName: false
	},

	_create: function() {
		var JavaScriptMode = ace.require("ace/mode/javascript").Mode;

		this.editor = ace.edit('editor');
		this.editor.session.setMode(new JavaScriptMode());
		/*
		this.editor.commands.addCommand({
			name: 'save',
			bindkey: {
				win: 'Ctrl-S',
				mac: 'Command-S'
			},
			exec: $.proxy(function(editor) {
				this.save();
				return true;
			}, this)
		});
		*/
		$(window).on('keydown', $.proxy(function(event) {
			if (event.keyCode === 83 && (event.ctrlKey||event.metaKey)) {
				event.preventDefault();
				this.save();
			}
		}, this));

		this.recordingDisplay = $('#replay').recordingDisplay();

		var editorStatus = $('#editorStatus');
		this._updateImplementationsList();

		$('#save').on('click', $.proxy(this.save, this));
		this._updateGestureList().then($.proxy(function() {
			this._updateRecordingList();
			this._updateAvailableMethodsList();

			$('#implementations').on('change', $.proxy(function(event) {
				var implementationName = $(event.target).val();
				this._openImplementation(implementationName);
			}, this));

			$('#behaviors').on('change', $.proxy(function(event) {
				var behaviorName = $(event.target).val();
				this._openGesture(behaviorName).then($.proxy(function() {
					this._openRecording(behaviorName);
				}, this));
			}, this));

			$('#recordings').on('change', $.proxy(function(event) {
				this._openRecording($(event.target).val());
			}, this));
		}, this));

		$(window).on('resize', $.proxy(this._onResize, this));
		this._onResize();

		this.editor.getSession().on('change', $.proxy(function() {
			var saveStatus = $('#save_status');
			$('#save').removeClass('disabled');
			saveStatus.text('');
		}, this));
	},

	_updateAvailableMethodsList: function() {
		var availableMethodsArray = this.option(this.option('currentCondition') + 'AvailableMethods'),
			availableMethodsString = availableMethodsArray.join(', ');

		$('#avilableMethods').text(availableMethodsString);
	},

	_onResize: function() {
		$('html').height($(window).height())
	},

	_setOption: function(key, value) {
		var oldValue = this.option(key);
		this._super(key, value);
	},

	_openImplementation: function(implementation_name) {
		var behaviorName = this.option('currentGestureName');
		this.option('currentCondition', implementation_name);
		this.recordingDisplay.recordingDisplay('option', 'implementation', implementation_name);

		this._updateAvailableMethodsList();
		this._openGesture(this.option('currentGestureName')).then($.proxy(function() {
			this._openRecording(behaviorName);
		}, this));
	},

	_updateImplementationsList: function() {
		var implementations = this.option('conditions'),
			implementationsSelect = $('#implementations');

		_.each(implementations, function(implementation) {
			$('<option />', {
				text: implementation,
				attr: {
					value: implementation
				}
			}).appendTo(implementationsSelect);
		});
	},

	save: function() {
		var saveStatus = $('#save_status');

		saveStatus.text('Saving ' + this.option('gestureName'))
					.addClass('text-warning')
					.removeClass('text-danger text-success');

		$('#save').addClass('disabled');

		//editorStatus.text('Saving ' + gestureName);
		setBehavior(this.option('currentGestureName'), this._getCurrentGesture(), this.option('currentCondition')).then($.proxy(function() {
			//editorStatus.addClass('text-success').removeClass('text-warning').text('Saved "' + gestureName + '"');
			//$('#save').removeClass('disabled');
			this.refreshGesture();

			saveStatus.text('Saved ' + this.option('currentGestureName'));
		}, this), $.proxy(function(err) {
			//$('#save').removeClass('disabled');
			saveStatus	.addClass('text-danger')
						.removeClass('text-success text-warning')
						.text('Failed to save ' + this.option('gestureName') + ': ' + err);
		}, this));
	},

	refreshGesture: function() {
		var contents = this._getCurrentGesture();
		try {
			eval(contents);
			this.recordingDisplay.recordingDisplay('option', 'name', this.option('currentGestureName'));
		} catch(e) {
			console.error(e.stack);
		}
	},

	_openGesture: function(gestureName) {
		this.option('currentGestureName', gestureName);
		return getBehaviorCode(gestureName, this.option('currentCondition')).then($.proxy(function(contents) {
			this.option('currentGestureName', gestureName);
			var headerRegex = this.option(this.option('currentCondition') + 'HeaderRegex'),
				footerRegex = this.option(this.option('currentCondition') + 'FooterRegex');

			var strippedContents = contents	.replace(headerRegex, '')
											.replace(footerRegex, '');

			this.editor.setValue(strippedContents, -1);
			$('#save').addClass('disabled');
			this.refreshGesture();
		}, this));
	},

	_openRecording: function(recordingName) {
		$('#recordings').val(recordingName);

		getRecording(recordingName).then($.proxy(function(contents) {
			this.recordingDisplay.recordingDisplay('option', 'recording', contents);
		}, this));
	},

	_getCurrentGesture: function() {
		return this.option(this.option('currentCondition') + 'HeaderText').replace('$NAME', this.option('currentGestureName')) +
						this.editor.getSession().getValue() +
						this.option(this.option('currentCondition') + 'FooterText');
	},
	/*
	editor.getSession().on('change', function () {
	  editor.getSession().getValue();
  });
  */

	_updateGestureList: function() {
		var behaviorsElement = $('#behaviors');
		return getBehaviors(this.option('currentCondition')).then($.proxy(function(behaviors) {
			behaviorsElement.children().remove();
			behaviors.forEach(function(behavior) {
				$('<option />', {
					text: behavior.replace(/_/gi, ''),
					attr: {
						value: behavior
					}
				}).appendTo(behaviorsElement);
			});
			return this._openGesture(behaviors[0]);
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
			return this._openRecording(recordings[0]);
		}, this));
	},

	_destroy: function() {
		this.editor.destroy();
	}
});