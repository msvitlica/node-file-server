const http = require('http');
var url = require("url");
var path = require("path");
const fs= require('fs');
const port= 8080;
const headers= {
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Methods':'OPTIONS,POST,GET',
  'Access-Control-Max-Age':259200
};

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/addNewFile') {
    req.on('data', (chunk) => {
      let body=[];
      let bodyStr;
      body.push(chunk);
    }).on('end', () => {
      bodyStr = Buffer.concat(body).toString();
    const fileInfo= JSON.parse(bodyStr);
    console.log(fileInfo);
    fs.writeFile('/files'+ fileInfo.title, fileInfo.content,(err)=>{
      if(err){
        console.log(err);
        throw err;
      }
      res.writeHead(200,{'Content-Type': 'text/plain'});
      res.end();
    });
  });
}
}).listen(port, () => {

  console.log(`Hello world app listening on port ${port}!`)
});


