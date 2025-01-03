const requestHandler = (req, res) => {
	const url = req.url;
	const method = req.method;

	if (url === '/') {
		res.write('<html>');
		res.write('<head><title>My First Page</title></head>');
		res.write('<body><h1>Welcome to my Node.js Users Server</h1></body>');
		res.write(
			'<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form>'
		);
		res.write('</html>');
		return res.end();
	}

	if (url === '/users') {
		res.write('<html>');
		res.write('<head><title>My First Page</title></head>');
		res.write(
			'<body><ul><li>User 1</li><li>User 2</li><li>User 3</li></ul></body>'
		);
		res.write('</html>');
		return res.end();
	}

	if (url === '/create-user' && method === 'POST') {
		const body = [];
		// This will run when the request starts
		req.on('data', (chunk) => {
			body.push(chunk);
		});
		// This will run when the request ends
		return req.on('end', () => {
			const parsedBody = Buffer.concat(body).toString();
			const username = parsedBody.split('=')[1];
			console.log(username);
			res.statusCode = 302;
			res.setHeader('Location', '/');
			return res.end();
		});
	}
};

exports.handler = requestHandler;
