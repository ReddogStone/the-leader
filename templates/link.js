const head = require('./head');

module.exports = function(link) {
	return `
${head}

<body>
<h2>Your campaign link:</h2>
<div class="well">
	<a href="//${link}">${link}</a>
</div>
</body>
	`;
};
