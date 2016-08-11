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
		create: (name, estimate) => co(function*() {
			assert(name, 'Parameter "name" is required!');
			estimate = estimate || 0;

			let id = guid.raw();
			yield fs.writeFile.bind(fs, path.join(dbPath, id), `${name}_${estimate}`);
			return id;
		}),
		get: id => co(function*() {
			assert(id, 'Parameter "id" is required!');

			let content = yield fs.readFile.bind(fs, path.join(dbPath, id), 'utf8');
			let lines = content.split('\n');
			let [name, estimate] = lines[0].split('_');

			return {
				name: name,
				estimate: estimate,
				votes: lines.length - 1
			};
		})
	};
});