$.widget('iss.mcquestion', {
	options: {
		question: false,
		responseOptions: false,
		availabilityDelay: 30*1000,
	},

	_create: function() {
		this.questionContainer = $('<div />').addClass('question row')
									.appendTo(this.element);

		this.question = $('<div />').addClass('col-sm-12')
									.appendTo(this.questionContainer)
									.append(this.option('question'));

		this.optionsContainer = $('<div />').addClass('options row')
											.appendTo(this.element);
		this.notesContainer = $('<div />')	.addClass('notes row')
											.appendTo(this.element);
		this.notes = $('<textarea />')	.appendTo(this.notesContainer)
										.attr({
											placeholder: 'Notes'
										})
										.css({
											width: '100%'
										});

		this.submitContainer = $('<div />').addClass('next row')
											.appendTo(this.element);

		this.submitButton = $('<button />').attr({
				type: 'button'
			}).addClass('btn btn-default btn-lg disabled')
			.appendTo(this.submitContainer)
			.text('Next')
			.on('click', $.proxy(this._onSubmit, this))
			.append($('<span />').addClass('glyphicon glyphicon-chevron-right'));

		var availabilityDelay = this.option('availabilityDelay') || 0;
		this.optionsContainer.text('read the implementation for at least ' + Math.round(availabilityDelay/1000) + ' seconds before anwering');
		setTimeout(_.bind(function() {
			this.optionsContainer.text('');
			_.each(this.option('responseOptions'), function(option, index) {
				var optionDisplay = $('<div />').addClass('col-md-3 option')
												.appendTo(this.optionsContainer)
												.append($('<span />').text(index+1)
																	.addClass('number'))
												.append(option);
			}, this);
			$('.option', this.optionsContainer).on('click.optionSelected', $.proxy(this._optionSelected, this));
		}, this), availabilityDelay);

		this.lastFocus = this.startTime = (new Date()).getTime();
		this.timeInFocus = 0;

		$(window)	.on('keydown.submitanswer', $.proxy(this._onKeyPress, this))
					.on('focus.stoptiming', $.proxy(this._onWindowFocus, this))
					.on('blur.stoptiming', $.proxy(this._onWindowBlur, this));

		this.element.on('focus')
	},

	_destroy: function() {
		$('.option', this.optionsContainer).off('click.optionSelected');
		$(window).off('keydown.submitanswer focus.stoptiming blur.stoptiming');
		this.questionContainer.remove();
		this.optionsContainer.remove();
		this.submitContainer.remove();
		this.notesContainer.remove();
	},

	_onWindowFocus: function() {
		this.lastFocus = (new Date()).getTime();
	},

	_onWindowBlur: function() {
		this.timeInFocus += (new Date()).getTime() - this.lastFocus;
	},

	_onKeyPress: function(event) {
		var which = event.which;
		var responseOptions = this.option('responseOptions');
		if(which >= 49 && which <= 52) {
			this._setSelectedIndex(which - 49);
		} else if(which === 13) { // enter
			this._onSubmit();
		} else if(which === 39) { // right
			if(_.isNumber(this.selectedIndex)) {
				this._setSelectedIndex((this.selectedIndex+1)%responseOptions.length);
			} else {
				this._setSelectedIndex(0);
			}
		} else if(which === 37) { // left
			if(_.isNumber(this.selectedIndex)) {
				this._setSelectedIndex(this.selectedIndex === 0 ? responseOptions.length-1 : this.selectedIndex-1);
			} else {
				this._setSelectedIndex(responseOptions.length-1);
			}
		}
	},

	_setSelectedIndex: function(index) {
		this._optionSelected({
			target: this.optionsContainer.children().eq(index)
		});
	},

	_optionSelected: function(event) {
		var target = $(event.target).closest('.option');

		this.selectedIndex = target.index();
		this.selectedOption = this.options[this.selectedIndex];

		$('.option.selected', this.optionsContainer).removeClass('selected');
		target.addClass('selected');

		this.submitButton.removeClass('disabled');
	},

	_onSubmit: function() {
		if(_.isNumber(this.selectedIndex)) {
			this.timeInFocus += (new Date()).getTime() - this.lastFocus;

			var event = $.Event('answered');
			//event.selectedOption = this.selectedOption.serialize();
			//event.correct = this.selectedOption.correct;
			event.selectedIndex = this.selectedIndex;
			event.totalTime = (new Date()).getTime() - this.startTime;
			event.focusTime = this.timeInFocus;
			event.notes = this.notes.val();

			this.element.trigger(event);
		}
	}
});