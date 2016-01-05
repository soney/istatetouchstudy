var express = require('express'),
	sassMiddleware = require('node-sass-middleware'),
	path = require('path'),
	fs = require('fs'),
	app = express(),
	bodyParser = require('body-parser'),
	BEHAVIORS_DIR = path.join(__dirname, 'js', 'behaviors'),
	RECORDINGS_DIR = path.join(__dirname, 'js', 'recordings');

app.use(sassMiddleware({
	src: path.join(__dirname, 'css'),
	dest: path.join(__dirname, 'css'),
	prefix:  '/css',
	debug: true
}));

app	.use(express.static(__dirname))
	.use(bodyParser.urlencoded({ extended: false }))
	.get('/behaviors', function(req, res) {
		readDirectory(BEHAVIORS_DIR).then(function(behaviors) {
			return {
				data: behaviors.filter(function(filename) {
					return path.extname(filename) === '.js';
				}).map(function(filename) {
					return path.basename(filename, '.js');
				})
			};
		}, function(err) {
			return { error: err };
		}).then(function(response) {
			res.json(response);
		});
	})
	.get('/recordings', function(req, res) {
		readDirectory(RECORDINGS_DIR).then(function(recordings) {
			return {
				data: recordings.filter(function(filename) {
					return path.extname(filename) === '.json';
				}).map(function(filename) {
					return path.basename(filename, '.json');
				})
			};
		}, function(err) {
			return { error: err };
		}).then(function(response) {
			res.json(response);
		});
	})
	.get('/behavior/:behaviorName', function(req, res) {
		var behaviorName = req.params.behaviorName,
			behaviorPath = path.join(BEHAVIORS_DIR, behaviorName+'.js');

		res.sendFile(behaviorPath);
	})
	.get('/recording/:recordingName', function(req, res) {
		var recordingName = req.params.recordingName,
			recordingPath = path.join(RECORDINGS_DIR, recordingName+'.json');

		res.sendFile(recordingPath);
	})
	.post('/setBehavior/:behaviorName', function(req, res) {
		var behaviorName = req.params.behaviorName,
			behaviorPath = path.join(BEHAVIORS_DIR, behaviorName+'.js'),
			contents = req.body.contents;

		writeFile(behaviorPath, contents).then(function( ){
			return {};
		}, function(err) {
			return { error: err };
		}).then(function(response) {
			res.json(response);
		});
	})
	.post('/setRecording/:recordingName', function(req, res) {
		var recordingName = req.params.recordingName,
			recordingPath = path.join(RECORDINGS_DIR, recordingName+'.json'),
			contents = req.body.contents;

		writeFile(recordingPath, contents).then(function( ){
			return {};
		}, function(err) {
			return { error: err };
		}).then(function(response) {
			res.json(response);
		});
	});

app.listen(3000);
console.log('listening on localhost:3000');

function readDirectory(dirPath) {
	return new Promise(function(resolve, reject) {
		fs.readdir(dirPath, function(err, files) {
			if(err) {
				reject(err);
			} else {
				resolve(files);
			}
		});
	});
}

function writeFile(filePath, contents) {
	return new Promise(function(resolve, reject) {
		fs.writeFile(filePath, contents, { encoding: 'utf8' }, function(err) {
			if(err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}