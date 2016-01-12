function getRecordings() {
	return new Promise(function(resolve, reject) {
		$.ajax({
			url: '/recordings',
			method: 'GET',
			data: {}
		}).done(function(result) {
			if(result.error) {
				reject(result.error);
			} else {
				resolve(result.data);
			}
		}).fail(function(err) {
			reject(err);
		});
	});
}
function getBehaviors(condition) {
	if(!condition) {
		condition = 'control';
	}

	return new Promise(function(resolve, reject) {
		$.ajax({
			url: '/behaviors/'+condition,
			method: 'GET',
			data: {}
		}).done(function(result) {
			if(result.error) {
				reject(result.error);
			} else {
				resolve(result.data);
			}
		}).fail(function(err) {
			reject(err);
		});
	});
}

function getBehaviorCode(behaviorName, condition) {
	if(!condition) {
		condition = 'control';
	}
	return new Promise(function(resolve, reject) {
		$.ajax({
			url: '/behavior/'+condition+'/'+behaviorName,
			method: 'GET',
			dataType: 'text',
			data: {}
		}).done(function(result) {
			resolve(result);
		}).fail(function(err) {
			reject(err);
		});
	});
}

function getRecording(recordingName) {
	return new Promise(function(resolve, reject) {
		$.ajax({
			url: '/recording/'+recordingName,
			method: 'GET',
			dataType: 'json',
			data: {}
		}).done(function(result) {
			if(result.error) {
				reject(result.error);
			} else {
				resolve(result);
			}
		}).fail(function(err) {
			reject(err);
		});
	});
}

function setBehavior(behaviorName, contents, condition) {
	if(!condition) {
		condition = 'control';
	}
	return new Promise(function(resolve, reject) {
		$.ajax({
			url: '/setBehavior/' + condition + '/' + behaviorName,
			method: 'POST',
			data: {
				contents: contents
			}
		}).done(function(result) {
			if(result.error) {
				reject(result.error);
			} else {
				resolve(result.data);
			}
		}).fail(function(err) {
			reject(err);
		});
	});
}