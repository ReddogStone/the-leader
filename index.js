'use strict';

const http = require('http');
const { stack, finalizer, route } = require('yokto');
const Static = require('node-static');

const file = new Static.Server('./public');

const hostname = '127.0.0.1';
const port = 8000;

http.createServer(stack([
	request => response => file.serve(request, response)
])).listen(port, hostname, () => console.log(`Server started: ${hostname}:${port}`));