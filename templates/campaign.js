const head = require('./head');

module.exports = function(entry) {
	return `
${head}

<body>
<h2>Campaign</h2>
<h3>${entry.first.name}: ${entry.first.slogan}</h3> vs
<h3>${entry.second.name}: ${entry.second.slogan}</h3>

<h3>Votes</h3>
${entry.first.name}: ${entry.first.votes}
${entry.second.name}: ${entry.second.votes}
</body>
	`;
};
