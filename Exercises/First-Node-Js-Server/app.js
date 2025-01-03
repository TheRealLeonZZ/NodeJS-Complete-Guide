// Add the http module
const http = require('http');
const routes = require('./routes');

// Create a server that takes in a request and a response
const server = http.createServer(routes);

//Listen to port 3000
server.listen(3000);
