var Firebase = require('firebase');
var _ = require('underscore');
var dataRef = new Firebase('https://istatetouchstudy.firebaseio.com/');

var features = {
	'press and hold':						{std: true, discrete: true, static: true, multi:false},
	'tap':									{std: true, discrete: true, static: true, multi:false},
	'swipe to left':						{std: true, discrete: true, static:false, multi:false},
	'swipe up':								{std: true, discrete: true, static:false, multi:false},
	'force touch':							{std: true, discrete:false, static: true, multi:false},
	'two finger force touch':				{std: true, discrete:false, static: true, multi: true},
	'three finger tap into force touch':	{std: true, discrete:false, static: true, multi: true},
	'tap into force touch':					{std: true, discrete:false, static: true, multi:false},
	'up then down':							{std:false, discrete: true, static: true, multi:false},
	'left then right':						{std:false, discrete: true, static:false, multi:false},
	'two finger up then down':				{std:false, discrete: true, static:false, multi: true},
	'three finger left then right':			{std:false, discrete: true, static:false, multi: true},
	'press hold to increment':				{std:false, discrete:false, static: true, multi:false},
	'double tap count tap':					{std:false, discrete:false, static:false, multi:false},
	'two down left or right':				{std:false, discrete: true, static: true, multi: true},
	'two finger press hold to increment':	{std:false, discrete:false, static: true, multi: true},
	'two finger tap count tap':				{std:false, discrete:false, static: true, multi: true},
	'two finger down then left':			{std:false, discrete: true, static: true, multi: true},
	'two finger right then up':				{std:false, discrete: true, static:false, multi: true}
};

dataRef.child('study_results').on('value', function(snapshot) {
	var value = snapshot.val();
	var percentageCorrect = {};
	var participants = {};
	var numParticipants = {};
	var behaviorNames = {};
	var featureCount = {};
	_.each(snapshot.val(), function(results, participant_id) {
		var userResults = participants[participant_id] = { };
		_.each(results, function(trial) {
			_.each(trial.questions, function(question) {
				var selectedOption = question.selectedOption,
					implementation = question.implementation,
					correct = selectedOption.correct;

				var br = behaviorNames[question.behaviorName];
				if(!br) {
					br = behaviorNames[question.behaviorName] = {};
				}

				var bi = br[implementation];
				if(!bi) {
					bi = br[implementation] = {
						count: 0,
						correct: 0
					}
				}

				var ur = userResults[implementation];
				if(!ur) {
					ur = userResults[implementation] = {
						count: 0,
						correct: 0,
						time: 0
					};
				}
				_.each(features[question.behaviorName], function(hasFeature, featureName) {
					var fs = featureCount[featureName];
					if(!fs) {
						fs = featureCount[featureName] = {};
					}
					var fsi = fs[implementation];
					if(!fsi) {
						fsi = fs[implementation] = {
							has: {
								count: 0,
								correct: 0,
								time: 0
							},
							not: {
								count: 0,
								correct: 0,
								time: 0
							}
						}
					}
					var fsix = hasFeature ? fsi.has : fsi.not;
					fsix.count++;
					if(correct) {
						fsix.correct++;
					}
					fsix.time += question.focusTime;
				});


				ur.count++;
				bi.count++;
				if(correct) {
					ur.correct++;
					bi.correct++;
				}
				bi.pct = bi.correct/bi.count;
				ur.pct = ur.correct/ur.count;
				ur.time += question.focusTime;
			});
		});
		_.each(userResults, function(ur, implementation) {
			var pc = percentageCorrect[implementation];
			if(!pc) {
				pc = percentageCorrect[implementation] = {
					count: 0,
					correct: 0,
					time: 0
				};
			}
			pc.count += ur.count;
			pc.correct += ur.correct;
			pc.pct = pc.correct/pc.count;
			pc.time += ur.time;

			if(!numParticipants[implementation]) {
				numParticipants[implementation]=0;
			}
			numParticipants[implementation]++;
		});
	});
	var sum = {};
	var timeSum = {};
	_.each(participants, function(participant) {
		_.each(participant, function(imp_results, implementation) {
			if(!sum[implementation]) {
				sum[implementation] = 0;
			}
			if(!timeSum[implementation]) {
				timeSum[implementation] = 0;
			}
			sum[implementation] += Math.pow(imp_results.pct - percentageCorrect[implementation].pct, 2);
			timeSum[implementation] += Math.pow(imp_results.time - percentageCorrect[implementation].time/numParticipants[implementation], 2);
		});
	});

	var stdev = {};
	_.each(sum, function(sum, implementation) {
		percentageCorrect[implementation].stdev = Math.sqrt(sum/numParticipants[implementation]);
	});
	_.each(timeSum, function(sum, implementation) {
		percentageCorrect[implementation].timeStdev = Math.sqrt(sum/numParticipants[implementation]);
	});
	var pct = {};
	_.each(featureCount, function(result, name) {
		pct[name] = {};
		var count = {};
		var corr = {};
		_.each(result, function(r, implementation) {
			_.each(r, function(condR) {
				condR.pct = condR.correct/condR.count;
			});
			if(!count[implementation]) {
				count[implementation] = 0;
				corr[implementation] = 0;
			}
			count[implementation]+=r.has.count;
			corr[implementation]+=r.has.correct;
			pct[name][implementation] = corr[implementation]/count[implementation];
		});
	});
	_.each(pct, function(r, name) {
		console.log(name + ': ' + Math.round((r.primitives-r.control)*100)/100);
	});
	console.log('----------');
	_.each(percentageCorrect, function(result, condition) {
		var avgTime = result.time/numParticipants[condition];
		avgTime = Math.round(avgTime/1000);
		console.log(condition + ': ' + result.pct + ' ('+result.stdev+') ' + avgTime/60 + ' (' +  Math.round(result.timeStdev/(60*1000)) + ')');
	});
});
