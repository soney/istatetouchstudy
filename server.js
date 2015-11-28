var express = require('express'),
	sassMiddleware = require('node-sass-middleware'),
	path = require('path'),
	app = express();

app.use(sassMiddleware({
	src: path.join(__dirname, 'css'),
	dest: path.join(__dirname, 'css'),
	prefix:  '/css',
	debug: true
}));

app.use(express.static(__dirname));
app.listen(3000);
console.log('listening on localhost:3000');
