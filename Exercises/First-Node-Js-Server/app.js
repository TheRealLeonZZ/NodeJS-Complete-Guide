// Add the http module
const http = require("http");

// Create a server that takes in a request and a response
const server = http.createServer((req, res) => {
  console.log(req.url, req.method, req.headers);
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body><h1>Hello from my Node Server!</h1></body>");
  res.write("</html>");
  res.end();
});

//Listen to port 3000
server.listen(3000);
