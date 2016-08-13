const head = require('./head');

module.exports = function(id, entry) {
	return `
${head}

<body>
	<form role="form" action="/accept" id="campaign" method="post" accept-charset="UTF-8">
		<label class="h2" form="campaign">Campaign ${entry.campaign.name}: ${entry.campaign.description}</label>
		<label class="h3" form="campaign">Challenge from ${entry.first.name}: ${entry.first.slogan}</label>

		<input type="hidden" name="id" value="${id}">

		<div class="form-group">
			<label for="name">Your name</label>
			<input type="text" name="name" class="form-control" id="name">
		</div>
		<div class="form-group">
			<label for="slogan">Your slogan</label>
			<input type="text" name="slogan" class="form-control" id="slogan">
		</div>

		<a href="/" class="btn btn-default" role="button">Cancel</a>
		<button type="submit" class="btn btn-default">Accept</button>
	</form>
</body>
	`;
};
