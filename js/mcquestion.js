function getOptions() {
	return ['1', '2', '3', '4'];
}

$.widget('iss.mcquestion', {
	options: {
		
	},
	_create: function() {
		this.questionContainer = $('<div />').addClass('question row')
									.appendTo(this.element);

		this.question = $('<div />').addClass('col-sm-12')
									.text('question')
									.appendTo(this.questionContainer);

		this.optionsContainer = $('<div />').addClass('options row')
											.appendTo(this.element);

		this.submitContainer = $('<div />').addClass('row')
											.appendTo(this.element);

		this.submitButton = $('<button />').attr({
				type: 'button'
			}).addClass('btn btn-default btn-lg disabled')
			.appendTo(this.submitContainer)
			.text('Next')
			.on('click', $.proxy(this._onSubmit, this))
			.append($('<span />').addClass('glyphicon glyphicon-chevron-right'));

		$(window).on('keypress.submitanswer', $.proxy(this._onKeyPress, this));


		this._updateOptions();
	},

	_destroy: function() {

	},

	_onKeyPress: function(event) {
		var which = event.which;
		if(which >= 49 && which <= 52) {
			var selectionIndex = which - 49;
			this._optionSelected({
				target: this.optionsContainer.children().eq(selectionIndex)
			});
		} else if(which === 13) {
			this._onSubmit();
		}
	},

	_updateOptions: function() {
		this.options = getOptions();

		_.each(this.options, function(option) {
			var optionDisplay = $('<div />').addClass('col-md-3 option')
											.appendTo(this.optionsContainer)
											.text(option);
		}, this);

		$('.option', this.optionsContainer)
			.off('click.optionSelected')
			.on('click.optionSelected', $.proxy(this._optionSelected, this));
	},

	_optionSelected: function(event) {
		var target = $(event.target);

		this.selectedIndex = target.index();
		this.selectedOption = this.options[this.selectedIndex];

		$('.option.selected', this.optionsContainer).removeClass('selected');
		target.addClass('selected');

		this.submitButton.removeClass('disabled');
	},

	_onSubmit: function() {
		if(this.selectedOption) {
			console.log(this.selectedOption);
		}
	}
});
