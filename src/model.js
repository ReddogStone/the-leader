'use strict';

const mkdirp = require('mkdirp');
const co = require('co');
const guid = require('guid');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

function getVotes(lines) {
	return lines.map(line => {
		let parts = line.split('_');
		return {
			ip: parts[0],
			option: Number.parseInt(parts[1])
		};
	});
}

module.exports = (dbPath) => co(function*() {
	mkdirp.sync(dbPath);

	return {
		clear: () => co(function*() {
			let names = yield fs.readdir.bind(fs, dbPath);
			for (let name of names) {
				yield fs.unlink.bind(fs, path.join(dbPath, name));
			}
		}),
		create: params => co(function*() {
			assert(params.name, 'Parameter "name" is required!');

			let id = guid.raw();
			let campaign = {
				name: params.campaignName,
				description: params.campaignDescription
			};
			let creator = {
				name: params.name,
				slogan: params.slogan
			};
			yield fs.writeFile.bind(fs, path.join(dbPath, id), JSON.stringify(campaign) + '\n' + JSON.stringify(creator));
			return id;
		}),
		accept: params => co(function*() {
			assert(params.name, 'Parameter "name" is required!');
			let id = params.id;

			params = Object.assign({}, params);
			delete params.id;

			let content = yield fs.readFile.bind(fs, path.join(dbPath, id), 'utf8');
			if (content.split('\n').length > 2) { return false; }

			yield fs.appendFile.bind(fs, path.join(dbPath, id), '\n' + JSON.stringify(params));
			return true;
		}),
		get: id => co(function*() {
			assert(id, 'Parameter "id" is required!');

			let content = yield fs.readFile.bind(fs, path.join(dbPath, id), 'utf8');
			let lines = content.split('\n');

			let campaign = JSON.parse(lines[0]);

			let first = 0;
			let second = 0;
			if (lines.length > 3) {
				let votes = getVotes(lines.slice(3));
				for (let vote of votes) {
					if (vote.option === 0) { first++ };
				}
				second = votes.length - first;
			}

			return {
				campaign: campaign,
				first: Object.assign(JSON.parse(lines[1]), { votes: first }),
				second: lines.length > 2 ? Object.assign(JSON.parse(lines[2]), { votes: second }) : null
			};
		}),
		vote: (id, option, ip) => co(function*() {
			console.log('VOTE:', id, option, ip);

			let content = yield fs.readFile.bind(fs, path.join(dbPath, id), 'utf8');
			let lines = content.split('\n');

			let votes = getVotes(lines.slice(3));

			for (let vote of votes) {
				if (vote.ip === ip) {
					return false;
				}
			}

			yield fs.appendFile.bind(fs, path.join(dbPath, id), `\n${ip}_${option}`);
			return true;
		})
	};
});