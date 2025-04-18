const fs = require('fs');

const requestHandler = (req, res) => {
	const url = req.url;
	const method = req.method;
	if (url === '/') {
		res.write('<html>');
		res.write('<head><title>My First Page</title></head>');
		res.write('<body>');
		res.write('<h1>My First Page</h1>');
		res.write(
			"<form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form>"
		);
		res.write('</body>');
		res.write('</html>');
		return res.end();
	}
	if (url === '/message' && method === 'POST') {
		const body = [];
		// This will run when the request starts
		req.on('data', (chunk) => {
			console.log(chunk);
			body.push(chunk);
		});
		// This will run when the request ends
		return req.on('end', () => {
			const parsedBody = Buffer.concat(body).toString();
			const message = parsedBody.split('=')[1];
			fs.writeFile('message.txt', message, (err) => {
				res.statusCode = 302;
				res.setHeader('Location', '/');
				return res.end();
			});
		});
	}
};

// module.exports = requestHandler;

// module.exports = {
//   handler: requestHandler,
//   someText: 'Some hard coded text',
// };

// module.exports.handler = requestHandler;
// module.exports.someText = 'Some hard coded text';

exports.handler = requestHandler;
exports.someText = 'Some hard coded text';
