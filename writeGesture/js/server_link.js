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
function getBehaviors() {
	return new Promise(function(resolve, reject) {
		$.ajax({
			url: '/behaviors',
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

function getBehaviorCode(behaviorName) {
	return new Promise(function(resolve, reject) {
		$.ajax({
			url: '/behavior/'+behaviorName,
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

function setBehavior(behaviorName, contents) {
	return new Promise(function(resolve, reject) {
		$.ajax({
			url: '/setBehavior/'+behaviorName,
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