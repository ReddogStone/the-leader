'use strict';

const http = require('http');
const { stack, finalizer, route } = require('yokto');
const Static = require('node-static');
const url = require('url');
const querystring = require('querystring');
const co = require('co');

const file = new Static.Server('./public');

const hostname = '127.0.0.1';
const port = 8000;

function readBody(request) {
	let body = [];
	return new Promise(function(resolve, reject) {
		request.on('data', function(chunk) {
			body.push(chunk);
		}).on('end', function() {
			resolve(Buffer.concat(body).toString());
		}).on('error', reject);
	});
}

co(function*() {
	const model = yield require('./src/model')('db');

	http.createServer(stack([
		route.post('/create', request => co(function*() {
			let body = yield readBody(request);
			let params = querystring.parse(body);

			if (!params.name) { return finalizer.end(422, 'Parameter "name" required'); }

			let id = yield model.create(params.name, params.estimate);

			return finalizer.end(200, `Share this link: ${request.socket.remoteAddress}:${request.socket.localPort}/campaigns/${id}`);
		})),

		route.regex(/^\/campaigns/, request => co(function*() {
			let pathname = url.parse(request.url).pathname;
			let res = /^\/campaigns\/([\w-]+)/.exec(pathname);
			if (!res) { return finalizer.end(400, `Malformed request: "${pathname}"`); }

			let id = res[1];
			let entry = yield model.get(id);
			return finalizer.end(200, JSON.stringify(entry, 0, 4));
		})),

		route.get('/', request => finalizer.redirect('/index.html')),
		route.get('/index.html', request => response => file.serve(request, response)),
		route.get('/create.html', request => response => file.serve(request, response)),

		route.regex(/css$/, request => response => file.serve(request, response))
	])).listen(port, hostname, () => console.log(`Server started: ${hostname}:${port}`));
}).catch(function(error) {
	console.error('Top level:', error.stack);
});