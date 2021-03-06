var SAVEKEY = 'istatetouchstudy';

function loadQuestion(behaviors, serializedQuestion) {
	var question = getQuestion(behaviors, serializedQuestion.implementation, serializedQuestion.behaviorName, false);
	var rv = _.extend({},
		serializedQuestion,
		question, {
			responseOptions: _.map(serializedQuestion.responseOptions, function(ro) {
				return loadOption(ro);
			})
		});
	if(rv.selectedOption) {
		rv.selectedOption = loadOption(rv.selectedOption);
	}
	return rv;
}

function loadOption(serializedOption) {
	return getOption(serializedOption.behaviorName, serializedOption.correct);
}

function getQuestion(behaviors, implementation, behaviorName, numResponseOptions) {
	var codePromise = getBehaviorCode(behaviorName, implementation),
		responseOptions;

	if(numResponseOptions && numResponseOptions > 0) {
		var correctResponse = getOption(behaviorName, true),
			otherPossibleBehaviors = _.without(behaviors, behaviorName),
			responseOptions = _.map(shuffleUntil(otherPossibleBehaviors, numResponseOptions), function(optionName) {
				return getOption(optionName, false);
			});

		responseOptions[Math.floor(Math.random()*responseOptions.length)] = correctResponse;
	} else {
		responseOptions = false;
	}

	return {
		serialize: function() {
			var rv = _.extend({}, this, {
				implementation: implementation,
				behaviorName: behaviorName,
				responseOptions: _.map(this.responseOptions, function(ro) {
					return ro.serialize();
				})
			});
			delete rv.serialize;

			if(rv.selectedOption) {
				rv.selectedOption = rv.selectedOption.serialize();
			}

			delete rv.getElement;

			return rv;
		},
		getElement: function() {
			return Promise.join(codePromise, function(codeStr) {
				codeStr = codeStr.substring(codeStr.indexOf('\n')+1, codeStr.lastIndexOf('\n')-1);
				codeStr = codeStr.replace(/^\t/gm, '');
				/*

				var ast = esprima.parse(codeStr);
				var result = esmangle.mangle(ast);  // gets mangled result
				var generatedCodeStr = escodegen.generate(result, {
					format: {
						indent: {
			                style: '    ',
			                base: 0,
			                adjustMultilineComment: false
			            },
					},
					comment: false
				});  // dump AST

											*/
				var preElem = $('<pre />');
				var codeElem = $('<code />').appendTo(preElem)
											.text(codeStr);
											//.text(generatedCodeStr);
				hljs.highlightBlock(codeElem[0]);
				return preElem;
			});
		},
		responseOptions: responseOptions
	};
}

function getOption(behaviorName, isCorrect) {
	var behaviorPromise = getBehaviorCode(behaviorName),
		recordingPromise = getRecording(behaviorName);

	return {
		serialize: function() {
			return {
				correct: this.correct,
				behaviorName: behaviorName
			};
		},
		getElement: function() {
			return Promise.join(behaviorPromise, recordingPromise, function(behavior, recording) {
				return $('<div />').touchscreenOption({
					name: behaviorName,
					recording: recording
				});
			});
		},
		correct: isCorrect
	}
}
$.widget('iss.mcquiz', {
	options: {
		numResponseOptions: 4,
		numQuestions: 10,
		currentQuestion: 1,
		implementation: 'primitives',
		uid: guid()
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
		if(loadedValue && loadedValue.currentQuestion <= loadedValue.numQuestions) {
			this._questions = loadedValue.questions;
			this._uid = loadedValue.uid;
			this._started = loadedValue.started;
			this.option({
				numQuestions: loadedValue.numQuestions,
				currentQuestion: loadedValue.currentQuestion
			});

			this._updateProgressBar();
			this._updateCurrentQuestion();
		} else {
			this._generateQuestions().then($.proxy(function(questions) {
				this._questions = questions;
				_.map(this._questions, function(q) {
					_.extend(q, {
						answered: false
					})
				})
				this._uid = this.option('uid');
				this._started = (new Date()).getTime();

				this._updateProgressBar();
				this._updateCurrentQuestion();
			}, this));
		}

		$(window).on('beforeunload', $.proxy(this._onBeforeUnload, this));
	},

	_destroy: function() {

	},

	_generateQuestions: function() {
		var implementation = this.option('implementation');
		return getBehaviors().then($.proxy(function(behaviors) {
			var numResponseOptions = this.option('numResponseOptions'),
				behaviorList = shuffleUntil(behaviors, this.option('numQuestions'));

			var questions = _.map(behaviorList, function(behaviorName) {
				return getQuestion(behaviors, implementation, behaviorName, numResponseOptions);
			});

			return questions;
		}, this));
	},

	_onBeforeUnload: function() {
		//this._save();
	},

	_save: function() {
		var stringifiedValue = JSON.stringify(this._serialize());
		localStorage.setItem(SAVEKEY, stringifiedValue);
	},

	_load: function() {
		var stringifiedValue = localStorage.getItem(SAVEKEY);

		if(stringifiedValue) {
			var serializedQuestions = JSON.parse(stringifiedValue);
			var questions = _.map(serializedQuestions.questions, function(serializedQuestion) {
				return loadQuestion(serializedQuestion);
			});
			return _.extend({}, serializedQuestions, {
				questions: questions
			});
			//val.questions = _.map(val.questions, function(serializedQuestion, index) {
				//return loadQuestion(serializedQuestion);
				/*
				var question = getQuestion(serializedQuestion.behaviorName),
					responseOptions = _.map(serializedQuestion.responseOptions, function(responseOption) {
						return getOption(responseOption.behaviorName, responseOption.correct);
					});
				return {
					question: question,
					responseOptions: responseOptions,
					serialize: function() {
						return {
							question: question.serialize(),
							responseOptions: _.map(responseOptions, function(ro) {
								return ro.serialize()
							})
						};
					}
				}
				*/
			//});
			/*
			val.answers = _.map(val.answers, function(serializedAnswer, index) {
				var question = val.questions[index];
				return _.extend(serializedAnswer, {
					question: question,
					selectedOption: question.responseOptions[serializedAnswer.selectedIndex]
				});
			});
			return val;
			*/
		}
		return false;
	},

	_removeSaved: function() {
		localStorage.removeItem(SAVEKEY);
	},

	_serialize: function() {
		return {
			uid: this._uid,
			numQuestions: this.option('numQuestions'),
			currentQuestion: this.option('currentQuestion'),
			questions: _.map(this._questions, function(q) {
				return q.serialize();
			}),
			/*
			answers: _.map(this._answers, function(a) {
				return _.extend({}, a, {
					question: a.question.serialize(),
					selectedOption: a.selectedOption ? a.selectedOption.serialize() : false
				});
			}, this),
			*/
			started: this._started,
			serialized: (new Date()).getTime()
		};
	},

	_onQuestionAnswered: function(event) {
		_.extend(this._questions[this.option('currentQuestion')-1], {
			answered: true,
			totalTime: event.totalTime,
			focusTime: event.focusTime,
			notes: event.notes,
			selectedOption: this._currentQuestion.responseOptions[event.selectedIndex],
			selectedIndex: event.selectedIndex
		});

		this.option('currentQuestion', this.option('currentQuestion')+1);
	},

	_updateCurrentQuestion: function() {
		var currentQuestion = this._questions[this.option('currentQuestion')-1];
		var questionElement = Promise.resolve(currentQuestion.getElement());
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

		var myFirebaseRef = new Firebase('https://istatetouchstudy.firebaseio.com/');
		myFirebaseRef.child('study_results').child(results.uid).push(results);

		this._removeSaved();
	}

});

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}

	return s4() + s4() + '_' + s4() + '_' + s4() + '_' +
			s4() + '_' + s4() + s4() + s4();
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex ;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function shuffleUntil(options, length) {
	if(options.length === 0) { throw new Error('No options'); }

	var rv = [];
	while(rv.length < length) {
		rv.push.apply(rv, shuffle(options));
	}
	rv = _.first(rv, length);
	return rv;
}