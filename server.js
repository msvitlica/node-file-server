const http = require('http');
var url = require("url");
var path = require("path");
const fs = require('fs');
const port = 8080;
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
  'Access-Control-Max-Age': 259200
};

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/addNewFile') {
    let body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      const fileInfo = JSON.parse(body);
      const directoryPath = path.join(__dirname, '/files', fileInfo.title + '.txt');
      console.log(directoryPath);
      fs.writeFile(directoryPath, fileInfo.content, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      })
      res.writeHead(200, headers);
      res.end();
    });
  }
  else if (req.url === '/getAllFiles' && req.method === 'GET'){
    //procitati fajlove iz files i poslati ih na client side
    const directoryPath = path.join(__dirname, 'files');
    fs.readdir(directoryPath, function (err, files) {
      if (err) {
       return console.log(err);
    }
    res.writeHead(200, headers);
    res.end(JSON.stringify(files));
  })
}
}).listen(port, () => {

  console.log(`Hello world app listening on port ${port}!`)
});


