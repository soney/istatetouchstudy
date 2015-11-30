function getOptions() {

}

$.widget('iss.mcquestion', {
	options: {
		getQuestion: function() {
			return new Promise(function(resolve, reject) {
				$.ajax({
					url: 'js/behaviors/tap.js',
					dataType: 'text'
				}).done(function(val) {
					console.log(val);
					resolve(val);
				}).error(function(err) {
					console.error(err);
				});
			}).then(function(codeStr) {
				codeStr = codeStr.substring(codeStr.indexOf('\n')+1, codeStr.lastIndexOf('\n')-1);
				codeStr = codeStr.replace(/^\t/gm, '');
				var preElem = $('<pre />');
				var codeElem = $('<code />').appendTo(preElem)
											.text(codeStr);
				hljs.highlightBlock(codeElem[0]);
				return preElem;
			});
		},
		getResponseOptions: function() {
			function getOption(num, isCorrect) {
				return {
					serialize: function() {
						return num;
					},
					getElement: function() {
						return $('<div />').text(num);
					},
					correct: isCorrect
				}
			}

			return[getOption('A', false), getOption('B', true), getOption('C', false), getOption('D', false)];
		}
	},

	_create: function() {
		this.questionContainer = $('<div />').addClass('question row')
									.appendTo(this.element);

		this.question = $('<div />').addClass('col-sm-12')
									.appendTo(this.questionContainer);

		Promise.method(this.option('getQuestion'))().then(_.bind(function(elem) {
			this.question.append(elem);
		}, this));


		this.optionsContainer = $('<div />').addClass('options row')
											.appendTo(this.element);

		this.submitContainer = $('<div />').addClass('next row')
											.appendTo(this.element);

		this.submitButton = $('<button />').attr({
				type: 'button'
			}).addClass('btn btn-default btn-lg disabled')
			.appendTo(this.submitContainer)
			.text('Next')
			.on('click', $.proxy(this._onSubmit, this))
			.append($('<span />').addClass('glyphicon glyphicon-chevron-right'));



		this.options = this.option('getResponseOptions')();

		_.each(this.options, function(option, index) {
			var optionDisplay = $('<div />').addClass('col-md-3 option')
											.appendTo(this.optionsContainer)
											.append($('<span />').text(index+1)
																.addClass('number'));
			Promise.method(option.getElement)().then(function(elem) {
				optionDisplay.append(elem);
			});
		}, this);

		$('.option', this.optionsContainer).on('click.optionSelected', $.proxy(this._optionSelected, this));
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
	},

	_onWindowFocus: function() {
		this.lastFocus = (new Date()).getTime();
	},

	_onWindowBlur: function() {
		this.timeInFocus += (new Date()).getTime() - this.lastFocus;
	},

	_onKeyPress: function(event) {
		var which = event.which;
		if(which >= 49 && which <= 52) {
			this._setSelectedIndex(which - 49);
		} else if(which === 13) { // enter
			this._onSubmit();
		} else if(which === 39) { // right
			if(_.isNumber(this.selectedIndex)) {
				this._setSelectedIndex((this.selectedIndex+1)%this.options.length);
			} else {
				this._setSelectedIndex(0);
			}
		} else if(which === 37) { // left
			if(_.isNumber(this.selectedIndex)) {
				this._setSelectedIndex(this.selectedIndex === 0 ? this.options.length-1 : this.selectedIndex-1);
			} else {
				this._setSelectedIndex(this.options.length-1);
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
		if(this.selectedOption) {
			this.timeInFocus += (new Date()).getTime() - this.lastFocus;

			var event = $.Event('answered');
			event.selectedOption = this.selectedOption.serialize();
			event.correct = this.selectedOption.correct;
			event.totalTime = (new Date()).getTime() - this.startTime;
			event.focusTime = this.timeInFocus;

			this.element.trigger(event);
		}
	}
});
