$.widget('iss.mcquiz', {
	options: {
		numQuestions: 20,
		currentQuestion: 1
	},
	_create: function() {
		this.container = $('<div />')	.addClass('container')
										.appendTo(this.element);

		this.progressBarRow = $('<div />')	.addClass('progress')
											.appendTo(this.container);

		this.progressBar = $('<div />')	.addClass('progress-bar')
										.attr({
											role: 'progressbar'
										})
										.css({
											'min-width': '2em'
										})
										.appendTo(this.progressBarRow);

		this.questionContainer = $('<div />')	.addClass('container')
												.appendTo(this.element)
												.mcquestion();

		this._updateProgressBar();
	},
	_destroy: function() {

	},
	setOption: function(key, value) {
		this._super(key, value);

		if(key === 'currentQuestion' || key === 'numQuestions') {
			this._updateProgressBar();
		}
	},
	_updateProgressBar: function() {
		var currentQuestion = this.option('currentQuestion'),
			numQuestions = this.option('numQuestions'),
			percentage = Math.round(100*currentQuestion / numQuestions);

		this.progressBar.css({
			width: percentage + '%'
		}).text(currentQuestion + '/' + numQuestions);
	}

});
