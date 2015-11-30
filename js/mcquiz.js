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
												.mcquestion()
												.on('answered', $.proxy(this._onQuestionAnswered, this));

		this._updateProgressBar();
	},
	_destroy: function() {

	},
	_onQuestionAnswered: function(event) {
		var selectedOption = event.selectedOption;
		var correct = event.correct;
		var totalTime = event.totalTime;
		var focusTime = event.focusTime;

		this.option('currentQuestion', this.option('currentQuestion')+1);
	},
	_setOption: function(key, value) {
		this._super(key, value);

		if(key === 'currentQuestion' || key === 'numQuestions') {
			this._updateProgressBar();
		}

		if(key === 'currentQuestion') {
			this.questionContainer.mcquestion('destroy');

			if(value > this.option('numQuestions')) {
				this.questionContainer.text('Thank you');
			} else {
				this.questionContainer.mcquestion();
			}
		}
	},
	_updateProgressBar: function() {
		var currentQuestion = this.option('currentQuestion'),
			numQuestions = this.option('numQuestions');
		currentQuestion = Math.min(currentQuestion, numQuestions);
		var percentage = Math.round(100*currentQuestion / numQuestions);

		this.progressBar.css({
			width: percentage + '%'
		}).text(currentQuestion + '/' + numQuestions);
	}

});
