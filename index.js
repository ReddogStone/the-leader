'use strict';

const http = require('http');
const { stack, finalizer, route } = require('yokto');
const Static = require('node-static');
const url = require('url');
const querystring = require('querystring');
const co = require('co');

const Templates = {
	CAMPAIGN: require('./templates/campaign'),
	CHALLENGE: require('./templates/challenge'),
	LINK: require('./templates/link')
};

const file = new Static.Server('./public');

const port = process.env.PORT || 8000;

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
		route.get('/clear', request => co(function*() {
			yield model.clear();
			return finalizer.end(200, 'OK');
		})),

		route.post('/create', request => co(function*() {
			let body = yield readBody(request);
			let params = querystring.parse(body);

			if (!params.campaignName) { return finalizer.end(422, 'Parameter "campaignName" required'); }
			if (!params.name) { return finalizer.end(422, 'Parameter "name" required'); }

			let id = yield model.create(params);

			let link = Templates.LINK(`${request.headers.host}/campaigns/${id}`);
			return finalizer.end(200, link, { "Content-Type": "text/html" });
		})),

		route.post('/accept', request => co(function*() {
			let body = yield readBody(request);
			let params = querystring.parse(body);

			if (!params.id) { return finalizer.end(422, 'Parameter "id" required'); }
			if (!params.name) { return finalizer.end(422, 'Parameter "name" required'); }

			let ok = yield model.accept(params);
			if (!ok) {
				return finalizer.end(200, `Sorry, this challenge has already been accepted`);
			}

			let link = Templates.LINK(`${request.headers.host}/campaigns/${params.id}`);
			return finalizer.end(200, link, { "Content-Type": "text/html" });
		})),

		route.post('/vote', request => co(function*() {
			let body = yield readBody(request);
			let params = querystring.parse(body);

			if (!params.id) { return finalizer.end(422, 'Parameter "id" required'); }

			let ok = yield model.vote(params.id, Number.parseInt(params.option), request.socket.remoteAddress);
			if (!ok) {
				return finalizer.end(200, `Sorry, you have already voted`);
			}

			return finalizer.redirect(`/campaigns/${params.id}`);
		})),

		route.regex(/^\/campaigns/, request => co(function*() {
			let pathname = url.parse(request.url).pathname;
			let res = /^\/campaigns\/([\w-]+)/.exec(pathname);
			if (!res) { return finalizer.end(400, `Malformed request: "${pathname}"`); }

			let id = res[1];
			let entry = yield model.get(id);

			let result = (entry.second ? Templates.CAMPAIGN : Templates.CHALLENGE)(id, entry)

			return finalizer.end(200, result, { "Content-Type": "text/html" });
		})),

		route.get('/', request => finalizer.redirect('/index.html')),
		route.get('/index.html', request => response => file.serve(request, response)),
		route.get('/create.html', request => response => file.serve(request, response)),

		route.regex(/css$/, request => response => file.serve(request, response))
	])).listen(port, () => console.log(`Server started on port ${port}`));
}).catch(function(error) {
	console.error('Top level:', error.stack);
});