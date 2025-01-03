const http = require('http');
const routes = require('./routes');

// Create a server that takes in a request and a response
const server = http.createServer(routes.handler);

server.listen(3000);
