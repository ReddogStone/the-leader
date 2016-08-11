'use strict';

const http = require('http');
const { stack, finalizer, route } = require('yokto');
const Static = require('node-static');
const mkdirp = require('mkdirp');

const file = new Static.Server('./public');

const hostname = '127.0.0.1';
const port = 8000;

mkdirp.sync('db');

http.createServer(stack([
	route.get('/', request => finalizer.redirect('/index.html')),
	route.get('/index.html', request => response => file.serve(request, response)),
	route.regex(/css$/, request => response => file.serve(request, response))
])).listen(port, hostname, () => console.log(`Server started: ${hostname}:${port}`));
