module.exports = function(entry) {
	return `
<head>
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
	<link rel="stylesheet" href="/main.css">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

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
