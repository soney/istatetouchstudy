var express = require('express'),
	sassMiddleware = require('node-sass-middleware'),
	path = require('path'),
	fs = require('fs'),
	app = express(),
	bodyParser = require('body-parser'),
	PORT = 3000,
	BEHAVIORS_DIR = path.join(__dirname, 'gestures', 'implementations'),
	RECORDINGS_DIR = path.join(__dirname, 'gestures', 'recordings');

app.use(sassMiddleware({
	src: path.join(__dirname, 'css'),
	dest: path.join(__dirname, 'css'),
	prefix:  '/css',
	debug: true
}));

app	.use(express.static(__dirname))
	.use(bodyParser.urlencoded({ extended: false }))
	.get('/behaviors/:condition', function(req, res) {
		var condition = req.params.condition;

		readDirectory(path.join(BEHAVIORS_DIR, condition)).then(function(behaviors) {
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
					return path.basename(filename, '.recording.json');
				})
			};
		}, function(err) {
			return { error: err };
		}).then(function(response) {
			res.json(response);
		});
	})
	.get('/behavior/:condition/:behaviorName', function(req, res) {
		var behaviorName = req.params.behaviorName,
			condition = req.params.condition,
			behaviorPath = path.join(BEHAVIORS_DIR, condition, behaviorName+'.js');

		res.sendFile(behaviorPath);
	})
	.get('/recording/:recordingName', function(req, res) {
		var recordingName = req.params.recordingName,
			recordingPath = path.join(RECORDINGS_DIR, recordingName+'.recording.json');

		res.sendFile(recordingPath);
	})
	.post('/setBehavior/:condition/:behaviorName', function(req, res) {
		var behaviorName = req.params.behaviorName,
			condition = req.params.condition,
			behaviorPath = path.join(BEHAVIORS_DIR, condition, behaviorName+'.js'),
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
			recordingPath = path.join(RECORDINGS_DIR, recordingName+'.recording.json'),
			contents = req.body.contents;

		writeFile(recordingPath, contents).then(function( ){
			return {};
		}, function(err) {
			return { error: err };
		}).then(function(response) {
			res.json(response);
		});
	});

var os = require('os'),
	interfaces = os.networkInterfaces(),
	addresses = [],
	address;

for (k in interfaces) {
    for (k2 in interfaces[k]) {
        address = interfaces[k][k2];
        if (address.family == 'IPv4' && !address.internal) {
            addresses.push(address.address)
        }
    }
}

var URL = 'http://' + addresses[0] + ':' + PORT + '/';
app.listen(PORT);
console.log("Open " + URL + " or " + URL + "writeGesture.html in a Web browser.");

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