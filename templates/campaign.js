const head = require('./head');

module.exports = function(id, entry) {
	return `
${head}

<body>
<h2>Campaign ${entry.campaign.name}: ${entry.campaign.description}</h2>
<h3>${entry.first.name}: ${entry.first.slogan} - ${entry.first.votes} votes</h3> <br/>
vs
<h3>${entry.second.name}: ${entry.second.slogan} - ${entry.second.votes} votes</h3>

<form role="form" action="/vote" id="campaign" method="post">
	<input type="hidden" name="id" value="${id}">
	<input type="hidden" name="option" value="0">
	<button type="submit" class="btn btn-default">Vote ${entry.first.name}</button>
</form>

<form role="form" action="/vote" id="campaign" method="post">
	<input type="hidden" name="id" value="${id}">
	<input type="hidden" name="option" value="1">
	<button type="submit" class="btn btn-default">Vote ${entry.second.name}</button>
</form>

</body>
	`;
};
