'use strict';

const mkdirp = require('mkdirp');
const co = require('co');
const guid = require('guid');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

module.exports = (dbPath) => co(function*() {
	mkdirp.sync(dbPath);

	return {
		create: params => co(function*() {
			assert(params.name, 'Parameter "name" is required!');

			let id = guid.raw();
			yield fs.writeFile.bind(fs, path.join(dbPath, id), JSON.stringify(params));
			return id;
		}),
		accept: params => co(function*() {
			assert(params.name, 'Parameter "name" is required!');
			let id = params.id;

			params = Object.assign({}, params);
			delete params.id;

			let content = yield fs.readFile.bind(fs, path.join(dbPath, id), 'utf8');
			if (content.split('\n').length > 1) { return false; }

			yield fs.appendFile.bind(fs, path.join(dbPath, id), '\n' + JSON.stringify(params));
			return true;
		}),
		get: id => co(function*() {
			assert(id, 'Parameter "id" is required!');

			let content = yield fs.readFile.bind(fs, path.join(dbPath, id), 'utf8');
			let lines = content.split('\n');

			let first = 0;
			let second = 0;
			if (lines.length > 2) {

			}

			return {
				first: Object.assign(JSON.parse(lines[0]), { votes: first }),
				second: lines.length > 1 ? Object.assign(JSON.parse(lines[1]), { votes: second }) : null
			};
		})
	};
});