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
		create: (params) => co(function*() {
			assert(params.name, 'Parameter "name" is required!');

			let id = guid.raw();
			yield fs.writeFile.bind(fs, path.join(dbPath, id), JSON.stringify(params));
			return id;
		}),
		get: id => co(function*() {
			assert(id, 'Parameter "id" is required!');

			let content = yield fs.readFile.bind(fs, path.join(dbPath, id), 'utf8');
			let lines = content.split('\n');

			return Object.assign(JSON.parse(lines[0]), { votes: lines.length - 1 });
		})
	};
});