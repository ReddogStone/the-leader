module.exports = function(id, entry) {
	return `
<head>
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
	<link rel="stylesheet" href="/main.css">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
	<form role="form" action="/accept" id="campaign" method="post">
		<label class="h2" form="campaign">Accept challenge from ${entry.first.name}: ${entry.first.slogan}</label>

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
		<button type="submit" class="btn btn-default">Create</button>
	</form>
</body>
	`;
};
