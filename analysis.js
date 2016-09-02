var Firebase = require('firebase');
var _ = require('underscore');
var stringify = require('csv-stringify');

var MS_PER_MIN = 1000*60;

var features = {
	'press and hold':						{std:  true, discrete:  true, static:  true, multi: false},
	'tap':									{std:  true, discrete:  true, static:  true, multi: false},
	'swipe to left':						{std:  true, discrete:  true, static: false, multi: false},
	'swipe up':								{std:  true, discrete:  true, static: false, multi: false},
	'force touch':							{std:  true, discrete: false, static:  true, multi: false},
	'two finger force touch':				{std:  true, discrete: false, static:  true, multi:  true},
	'three finger tap into force touch':	{std:  true, discrete: false, static:  true, multi:  true},
	'tap into force touch':					{std:  true, discrete: false, static:  true, multi: false},
	'up then down':							{std: false, discrete:  true, static:  true, multi: false},
	'left then right':						{std: false, discrete:  true, static: false, multi: false},
	'two finger up then down':				{std: false, discrete:  true, static: false, multi:  true},
	'three finger left then right':			{std: false, discrete:  true, static: false, multi:  true},
	'press hold to increment':				{std: false, discrete: false, static:  true, multi: false},
	'double tap count tap':					{std: false, discrete: false, static: false, multi: false},
	'two down left or right':				{std: false, discrete:  true, static:  true, multi:  true},
	'two finger press hold to increment':	{std: false, discrete: false, static:  true, multi:  true},
	'two finger tap count tap':				{std: false, discrete: false, static:  true, multi:  true},
	'two finger down then left':			{std: false, discrete:  true, static:  true, multi:  true},
	'two finger right then up':				{std: false, discrete:  true, static: false, multi:  true}
};

function getRawStudyResults() {
	return new Promise(function(resolve, reject) {
		var dataRef = new Firebase('https://istatetouchstudy.firebaseio.com/');
		dataRef.child('study_results').on('value', function(snapshot) {
			resolve(snapshot.val());
			Firebase.goOffline();
		}, function(err) {
			reject(err);
		});
	});
}

function getTables() {
	return getRawStudyResults().then(function(fbresult) {
		var result = {
			comparative: {
				control: {}, // map from participant id to result
				primitives: {}
			},
			categories: { } // map from category to count
		};

		_.each(fbresult, function(all_user_results, participant_id) {
			if(_.size(all_user_results) !== 2) return;
			_.each(all_user_results, function(implementation_results) {
				_.each(implementation_results.questions, function(question) {
					if(question.answered) {
						var implementation = question.implementation,
							focusTime = question.focusTime,
							selectedOption = question.selectedOption,
							isCorrect = selectedOption.correct;

						if(!_.has(result.comparative[implementation], participant_id)) {
							result.comparative[implementation][participant_id] = {count: 0, correct: 0, focusTime: 0};
						}
						result.comparative[implementation][participant_id].count++;
						result.comparative[implementation][participant_id].focusTime += focusTime;

						if(isCorrect) {
							result.comparative[implementation][participant_id].correct++;
						}

						var behaviorFeatures = features[question.behaviorName];
						_.each(behaviorFeatures, function(hasFeature, featureName) {
							var keyName = hasFeature ? featureName : 'not_'+featureName;
							if(!_.has(result.categories, keyName)) {
								result.categories[keyName] = {
									control: {},
									primitives: {}
								};
							}
							if(!_.has(result.categories[keyName][implementation], participant_id)) {
								result.categories[keyName][implementation][participant_id] = {count: 0, correct: 0, focusTime: 0};
							}

							if(isCorrect) {
								result.categories[keyName][implementation][participant_id].correct++;
							}
							result.categories[keyName][implementation][participant_id].count++;
							result.categories[keyName][implementation][participant_id].focusTime += focusTime;
						});
					}
				});
			});
			// console.log(participant_id);
			// console.log(results);
		});
		var comparativeRows = [['id', 'control_correct', 'control_count', 'control_focus_time', 'primitives_correct', 'primitives_count', 'primitives_focus_time']]
		_.each(result.comparative.control, function(category_stats, participant_id) {
			var control_stats = category_stats,
				primitive_stats = result.comparative.primitives[participant_id];

			comparativeRows.push([
				participant_id, control_stats.correct, control_stats.count, control_stats.focusTime, primitive_stats.correct, primitive_stats.count, primitive_stats.focusTime
			]);
			// console.log(participant_id);
			// console.log(category_stats);
		});
		stringify(comparativeRows, function(err, output){
			console.log(output);
			console.log('');
		});

		var cols = ['std', 'discrete', 'static', 'multi'];
		for(var i = cols.length-1; i>=0; i--) {
			var notCol = 'not_'+cols[i];
			cols.splice(i+1, 0, notCol);
		}


		var participant_rows = {};

		_.each(result.categories, function(category_results, category_name) {
			// categoryRows.push([category_name])
			_.each(category_results.primitives, function(primitives_result, participant_id) {
				var control_result = category_results.control[participant_id];

				if(!_.has(participant_rows, participant_id)) {
					participant_rows[participant_id] = {}
				}
				participant_rows[participant_id][category_name] = {
					primitives: primitives_result,
					control: control_result
				}
			});
		});


		var headerRow = ['id'];
		_.each(cols, function(attrName) {
			_.each(['control', 'primitives'], function(implementation_type) {
				_.each(['correct_pct', 'count', 'focus_time_per_q'], function(measure) {
					headerRow.push(attrName+'_'+implementation_type+'_'+measure);
				});
			});
		});
		var categoryRows = [headerRow];

		_.each(participant_rows, function(participant_results, participant_id) {
			var row = [participant_id]
			_.each(cols, function(attrName) {
				_.each(['control', 'primitives'], function(implementation_type) {
					var measures = participant_results[attrName][implementation_type];
					row.push(measures.correct/measures.count, measures.count, measures.focusTime/measures.count);
				});
			});
			categoryRows.push(row);
		});

		stringify(categoryRows, function(err, output){
			console.log(output);
			console.log('');
			process.exit();
		});
		//
		// var implementations = ['control', 'primitives']
		//
		// var cells = {};
		//
		// _.each(cols, function(attrName) {
		// 	var category = result.categories[attrName];
		// 	_.each(implementations, function(implementation) {
		// 		var r = category[implementation];
		//
		// 		var counts = _.pluck(r, 'count'),
		// 			corrects = _.pluck(r, 'correct'),
		// 			focusTimes = _.pluck(r, 'focusTime');
		// 		var totalCount = sum.apply(this, counts),
		// 			averageCorrect = average.apply(this, corrects),
		// 			averageFocusTime = average.apply(this, focusTimes) / MS_PER_MIN,
		// 			correctStdev = samplestdev.apply(this, corrects),
		// 			focusStdev = samplestdev.apply(this, focusTimes) / MS_PER_MIN;
		//
		// 		cells[attrName+'_'+implementation] = {
		// 			averageCorrect: averageCorrect,
		// 			correctStdev: correctStdev,
		// 			averageFocusTime: averageFocusTime,
		// 			focusStdev: focusStdev,
		// 			totalCount: totalCount
		// 		};
		// 		// console.log(cutDecimals(averageCorrect) + ' ± ' + cutDecimals(correctStdev))
		// 		// console.log(cutDecimals(averageFocusTime) + ' ± ' + cutDecimals(focusStdev))
		// 		// console.log(totalCount);
		// 	});
		// });
		// _.each(implementations, function(implementation) {
		// 	var r = result.comparative[implementation];
		//
		// 	var counts = _.pluck(r, 'count'),
		// 		corrects = _.pluck(r, 'correct'),
		// 		focusTimes = _.pluck(r, 'focusTime');
		// 	var totalCount = sum.apply(this, counts),
		// 		averageCorrect = average.apply(this, corrects),
		// 		averageFocusTime = average.apply(this, focusTimes) / MS_PER_MIN,
		// 		correctStdev = samplestdev.apply(this, corrects),
		// 		focusStdev = samplestdev.apply(this, focusTimes) / MS_PER_MIN;
		//
		// 	cells['comparative_'+implementation] = {
		// 		averageCorrect: averageCorrect,
		// 		correctStdev: correctStdev,
		// 		averageFocusTime: averageFocusTime,
		// 		focusStdev: focusStdev,
		// 		totalCount: totalCount
		// 	};
		// });
		//
		// var allRows = [['']];
		// allRows[0].push.apply(allRows[0], implementations);
		//
		// allRows.push(['average_correct', cells.comparative_primitives.averageCorrect, cells.comparative_control.averageCorrect]);
		// allRows.push(['correct_stdev', cells.comparative_primitives.correctStdev, cells.comparative_control.correctStdev]);
		// allRows.push(['average_time', cells.comparative_primitives.averageFocusTime, cells.comparative_control.averageFocusTime]);
		// allRows.push(['time_stdev', cells.comparative_primitives.focusStdev, cells.comparative_control.focusStdev]);
		// allRows.push(['count', cells.comparative_primitives.totalCount, cells.comparative_control.totalCount]);
		// // _.each(implementations, function(implementation) {
		// // 	var row = [cells['comparative_'+implementation]];
		// // 	var rows = [[implementation],['_stdev_correct'],[implementation+'_average_time'],[implementation+'_stdev_time'] ,[implementation+'_count']]
		// // 	_.each(row, function(c) {
		// // 		rows[0].push(cutDecimals(c.averageCorrect));
		// // 		rows[1].push(cutDecimals(c.correctStdev));
		// // 		rows[2].push(cutDecimals(c.averageFocusTime));
		// // 		rows[3].push(cutDecimals(c.focusStdev));
		// // 		rows[4].push(c.totalCount);
		// // 	});
		// // 	allRows.push.apply(allRows, rows);
		// // });
		//
		// stringify(allRows, function(err, output){
		// 	console.log(output);
		// 	console.log('');
		// });
		//
		// var allRows = [['']];
		// allRows[0].push.apply(allRows[0], cols);
		// _.each(implementations, function(implementation) {
		// 	var row = _.map(cols, function(attrName) {
		// 		return cells[attrName+'_'+implementation];
		// 	});
		// 	var rows = [[implementation+'_average_correct'],[implementation+'_stdev_correct'],[implementation+'_average_time'],[implementation+'_stdev_time'] ,[implementation+'_count']]
		// 	_.each(row, function(c) {
		// 		rows[0].push(cutDecimals(c.averageCorrect));
		// 		rows[1].push(cutDecimals(c.correctStdev));
		// 		rows[2].push(cutDecimals(c.averageFocusTime));
		// 		rows[3].push(cutDecimals(c.focusStdev));
		// 		rows[4].push(c.totalCount);
		// 	});
		// 	allRows.push.apply(allRows, rows);
		// });
		//
		// // console.log(allRows);
		// stringify(allRows, function(err, output){
		// 	console.log(output);
		// 	process.exit();
		// });

		// console.log(cells);

		// process.exit();
		// console.log(result);
		// var percentageCorrect = {};
		// var participants = {};
		// var numParticipants = {};
		// var behaviorNames = {};
		// var featureCount = {};
		// _.each(fbresult, function(results, participant_id) {
		// 	var userResults = participants[participant_id] = { };
		// 	_.each(results, function(trial) {
		// 		_.each(trial.questions, function(question) {
		// 			var selectedOption = question.selectedOption,
		// 				implementation = question.implementation,
		// 				correct = selectedOption.correct;
		//
		// 			var br = behaviorNames[question.behaviorName];
		// 			if(!br) {
		// 				br = behaviorNames[question.behaviorName] = {};
		// 			}
		//
		// 			var bi = br[implementation];
		// 			if(!bi) {
		// 				bi = br[implementation] = {
		// 					count: 0,
		// 					correct: 0
		// 				}
		// 			}
		//
		// 			var ur = userResults[implementation];
		// 			if(!ur) {
		// 				ur = userResults[implementation] = {
		// 					count: 0,
		// 					correct: 0,
		// 					time: 0
		// 				};
		// 			}
		// 			_.each(features[question.behaviorName], function(hasFeature, featureName) {
		// 				var fs = featureCount[featureName];
		// 				if(!fs) {
		// 					fs = featureCount[featureName] = {};
		// 				}
		// 				var fsi = fs[implementation];
		// 				if(!fsi) {
		// 					fsi = fs[implementation] = {
		// 						has: {
		// 							count: 0,
		// 							correct: 0,
		// 							time: 0
		// 						},
		// 						not: {
		// 							count: 0,
		// 							correct: 0,
		// 							time: 0
		// 						}
		// 					}
		// 				}
		// 				var fsix = hasFeature ? fsi.has : fsi.not;
		// 				fsix.count++;
		// 				if(correct) {
		// 					fsix.correct++;
		// 				}
		// 				fsix.time += question.focusTime;
		// 			});
		//
		//
		// 			ur.count++;
		// 			bi.count++;
		// 			if(correct) {
		// 				ur.correct++;
		// 				bi.correct++;
		// 			}
		// 			bi.pct = bi.correct/bi.count;
		// 			ur.pct = ur.correct/ur.count;
		// 			ur.time += question.focusTime;
		// 		});
		// 	});
		// 	_.each(userResults, function(ur, implementation) {
		// 		var pc = percentageCorrect[implementation];
		// 		if(!pc) {
		// 			pc = percentageCorrect[implementation] = {
		// 				count: 0,
		// 				correct: 0,
		// 				time: 0
		// 			};
		// 		}
		// 		pc.count += ur.count;
		// 		pc.correct += ur.correct;
		// 		pc.pct = pc.correct/pc.count;
		// 		pc.time += ur.time;
		//
		// 		if(!numParticipants[implementation]) {
		// 			numParticipants[implementation]=0;
		// 		}
		// 		numParticipants[implementation]++;
		// 	});
		// });
		// var sum = {};
		// var timeSum = {};
		// _.each(participants, function(participant) {
		// 	_.each(participant, function(imp_results, implementation) {
		// 		if(!sum[implementation]) {
		// 			sum[implementation] = 0;
		// 		}
		// 		if(!timeSum[implementation]) {
		// 			timeSum[implementation] = 0;
		// 		}
		// 		sum[implementation] += Math.pow(imp_results.pct - percentageCorrect[implementation].pct, 2);
		// 		timeSum[implementation] += Math.pow(imp_results.time - percentageCorrect[implementation].time/numParticipants[implementation], 2);
		// 	});
		// });
		//
		// var stdev = {};
		// _.each(sum, function(sum, implementation) {
		// 	percentageCorrect[implementation].stdev = Math.sqrt(sum/numParticipants[implementation]);
		// });
		// _.each(timeSum, function(sum, implementation) {
		// 	percentageCorrect[implementation].timeStdev = Math.sqrt(sum/numParticipants[implementation]);
		// });
		// var pct = {};
		// _.each(featureCount, function(result, name) {
		// 	pct[name] = {};
		// 	var count = {};
		// 	var corr = {};
		// 	_.each(result, function(r, implementation) {
		// 		_.each(r, function(condR) {
		// 			condR.pct = condR.correct/condR.count;
		// 		});
		// 		if(!count[implementation]) {
		// 			count[implementation] = 0;
		// 			corr[implementation] = 0;
		// 		}
		// 		count[implementation]+=r.has.count;
		// 		corr[implementation]+=r.has.correct;
		// 		pct[name][implementation] = corr[implementation]/count[implementation];
		// 	});
		// });
		// console.log(pct;
		//
		// return {
		// 	numParticipants: numParticipants,
		// 	pct: pct,
		// 	percentageCorrect: percentageCorrect
		// };
	}).catch(function(err) {
		console.error(err.stack);
	});
}

function summarizeResults() {
	return getResultSummary().then(function(result) {
		console.log(Math.max.apply(Math, _.values(result.numParticipants)) + ' participants');
		console.log('----------');
		_.each(result.pct, function(r, name) {
			console.log(name + ': ' + cutDecimals(r.primitives-r.control, 3));
		});
		console.log('----------');
		_.each(result.percentageCorrect, function(pc, condition) {
			var avgTime = pc.time/result.numParticipants[condition];
			avgTime = avgTime/1000;
			console.log(condition + ': ' + cutDecimals(pc.pct*100, 3) + ' ('+cutDecimals(pc.stdev, 3)+') ' +
											cutDecimals(avgTime/60, 3) + ' (' +
												cutDecimals(pc.timeStdev/(1000*60), 3) + ')');
		});
		process.exit();
	}, function(err) {
		console.error(err.stack);
	});
}

function cutDecimals(num, places) {
	if(!places) {
		places = 2;
	}
	var ten = Math.pow(10, places);
	return Math.round(num*ten)/ten;
}
function getResultsCSV() {
	return getRawStudyResults().then(function(fbresults) {
		var implementations = {
			'control': [],
			'primitives': []
		}
		_.each(fbresults, function(results) {
			// if(_.size(results) !== 2) return;
			_.each(results, function(result) {
				var implementationTypes = {};
				_.each(result.questions, function(question) {
					if(question.answered) {
						var focusTime = question.focusTime,
							implementation = question.implementation,
							isCorrect = question.selectedOption.correct,
							r = {
								focusTime: focusTime,
								isCorrect: isCorrect
							};

						if(_.has(implementationTypes, implementation)) {
							implementationTypes[implementation].push(r);
						} else {
							implementationTypes[implementation] = [r];
						}
					}
				});
				_.each(implementationTypes, function(it, key) {
					var totalTime = 0,
						numCorrect = 0;

					_.each(it, function(r) {
						if(r.isCorrect) {
							numCorrect++;
						}
						totalTime += r.focusTime;
					});

					implementations[key].push({
						numCorrect: numCorrect,
						totalTime: totalTime
					});
				});
			});
		});
		var rows = [['controlCorrect', 'controlTime', 'istCorrect', 'istTime']];
		for(var i = 0; i<Math.max(implementations.control.length, implementations.primitives.length); i++) {
			var controli  = implementations.control[i] || {numCorrect:'',totalTime:''},
				primitivesi = implementations.primitives[i] || {numCorrect:'',totalTime:''};
			var row = [controli.numCorrect, controli.totalTime, primitivesi.numCorrect, primitivesi.totalTime]
			rows.push(row);
		}
		stringify(rows, function(err, output){
			console.log(output);
			process.exit();
		});
	}, function(err) {
		console.error(err.stack);
	});
}

function sum() {
	var result = 0;
	_.each(arguments, function(arg) {
		result += arg;
	});
	return result;
}
function samplestdev() {
	var mean = average.apply(this, arguments),
		n = arguments.length;

	var variance = sum.apply(this,_.map(arguments, function(arg) {
		return Math.pow(arg-mean, 2);
	}));
	return Math.sqrt(variance/(n-1));
}

function average() {
	return sum.apply(this, arguments)/arguments.length;
}

function rotate(arr) {
	return _.zip.apply(_, arr);
}

// getResultsCSV();
getTables();