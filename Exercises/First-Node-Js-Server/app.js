// Add the http module
const http = require('http');
// Add the fs module
const fs = require('fs');

// Create a server that takes in a request and a response
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form></body>"
    );
    res.write('</html>');
    return res.end();
  }

  if (req.url === '/message' && req.method === 'POST') {
    fs.writeFileSync('message.txt', 'DUMMY');
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }
});

//Listen to port 3000
server.listen(3000);
