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


		this._updateOptions();
	},

	_destroy: function() {

	},

	_updateOptions: function() {
		var options = getOptions();

		_.each(options, function(option) {
			var optionDisplay = $('<div />').addClass('col-md-3 option')
											.appendTo(this.optionsContainer)
											.text(option);
		}, this);

		$('.option', this.optionsContainer)
			.off('click.optionSelected')
			.on('click.optionSelected', $.proxy(this._optionSelected, this));
	},

	_optionSelected: function(event) {
		var target = event.target;
		$('.option.selected', this.optionsContainer).removeClass('selected');
		$(target).addClass('selected');
	}
});
