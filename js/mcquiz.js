var SAVEKEY = 'istatetouchstudy';

$.widget('iss.mcquiz', {
	options: {
		numQuestions: 16,
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
												.on('answered', $.proxy(this._onQuestionAnswered, this));


		var loadedValue = this._load();
		if(loadedValue) {
			console.log(loadedValue);
			this._questions = loadedValue.questions;
			this._answers = loadedValue.answers;
			this.option({
				numQuestions: loadedValue.numQuestions,
				currentQuestion: loadedValue.currentQuestion
			});
		} else {
			this._questions = this._generateQuestions(this.option('numQuestions'));
			this._answers = _.map(this._questions, function(q) {
				return {
					question: q,
					answered: false
				};
			});
		}

		this._updateProgressBar();
		this._updateCurrentQuestion();

		$(window).on('beforeunload', $.proxy(this._onBeforeUnload, this));
	},

	_destroy: function() {

	},

	_generateQuestions: function(numQuestions) {
		function getQuestion() {
			return {
				serialize: function() {
					return ''
				},
				getElement: function() {
					return new Promise(function(resolve, reject) {
						$.ajax({
							url: 'js/behaviors/tap.js',
							dataType: 'text'
						}).done(function(val) {
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
				}
			}
		}
		function getOption(num, isCorrect) {
			return {
				serialize: function() {
					return {
						correct: this.correct,
						id: num
					};
				},
				getElement: function() {
					return $('<div />').text(num);
				},
				correct: isCorrect
			}
		}
		var questions = [];
		for(var i = 0; i<numQuestions; i++) {
			questions.push({
				question: getQuestion(),
				responseOptions: [getOption('A', false), getOption('B', true), getOption('C', false), getOption('D', false)],
				serialize: function() {
					return {
						question: this.question.serialize(),
						responseOptions: _.map(this.responseOptions, function(response) {
							return response.serialize();
						})
					}
				}
			})
		}
		return questions;
	},

	_onBeforeUnload: function() {
		debugger;
		this._save();
	},

	_save: function() {
		var stringifiedValue = JSON.stringify(this._serialize());
		console.log(stringifiedValue);
		localStorage.setItem(SAVEKEY, stringifiedValue);
	},

	_load: function() {
		var stringifiedValue = localStorage.getItem(SAVEKEY);

		if(stringifiedValue) {
			var val = JSON.parse(stringifiedValue);
			var q = this._generateQuestions(val.numQuestions);
			val.questions = _.map(val.questions, function(serializedQuestion, index) {
				return q[index];
			});
			val.answers = _.map(val.answers, function(serializedAnswer, index) {
				return _.extend(serializedAnswer, {
					selectedOption: val.questions[index].responseOptions[serializedAnswer.selectedIndex]
				});
			});
			return val;
		}
		return false;
	},

	_removeSaved: function() {
		localStorage.clearItem(SAVEKEY);
	},

	_serialize: function() {
		return {
			numQuestions: this.option('numQuestions'),
			currentQuestion: this.option('currentQuestion'),
			questions: _.map(this._questions, function(q) {
				return q.serialize();
			}),
			answers: _.map(this._answers, function(a) {
				return _.extend({}, a, {
					question: a.question.serialize(),
					selectedOption: a.selectedOption ? a.selectedOption.serialize() : false
				});
			}, this),
		};
	},

	_onQuestionAnswered: function(event) {
		_.extend(this._answers[this.option('currentQuestion')-1], {
			answered: true,
			totalTime: event.totalTime,
			focusTime: event.focusTime,
			selectedOption: this._currentQuestion.responseOptions[event.selectedIndex],
			selectedIndex: event.selectedIndex
		});

		this.option('currentQuestion', this.option('currentQuestion')+1);
	},

	_updateCurrentQuestion: function() {
		var currentQuestion = this._questions[this.option('currentQuestion')-1];
		var questionElement = Promise.resolve(currentQuestion.question.getElement());
		var responseOptionElements = _.map(currentQuestion.responseOptions, function(responseOption) {
			return Promise.resolve(responseOption.getElement());
		});

		Promise.join(questionElement, Promise.all(responseOptionElements), _.bind(function(question, responseOptions) {
			this.questionContainer.mcquestion({
				question: question,
				responseOptions: responseOptions
			});
		}, this));
		this._currentQuestion = currentQuestion;
	},

	_setOption: function(key, value) {
		this._super(key, value);

		if(key === 'currentQuestion' || key === 'numQuestions') {
			this._updateProgressBar();
		}

		if(key === 'currentQuestion') {
			if(this.questionContainer.data('iss-mcquestion')) {
				this.questionContainer.mcquestion('destroy');
			}

			if(value > this.option('numQuestions')) {
				this.questionContainer.text('Thank you');
				this._transmitResults();
			} else {
				this._updateCurrentQuestion();
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
	},

	_transmitResults: function() {
		var results = this._serialize();

		this._removeSaved();
	}

});
