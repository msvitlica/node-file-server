const http = require('http');
var url = require("url");
var path = require("path");
const fs = require('fs');
const uuid = require('uuid');

const port = 8081;
const header = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
    'Access-Control-Max-Age': 2592000
}

let fileList = undefined;

try {
    const fileContent = fs.readFileSync('database.json');
    fileList = JSON.parse(fileContent);
}
catch (err) {
    console.log(err);

    console.log('database file doesnt exist, creating empty array');
    fileList = [];
}

http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', req.headers.origin);

    if (req.method === 'POST' && req.url === '/addNewFile') {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            const fileInfo = JSON.parse(body);

            const fileData = {
                id: uuid.v4(),
                name: fileInfo.title,
            }

            fileList.push(fileData);
            const directoryPath = path.join(__dirname, '/files', fileData.id + '.txt');

            fs.writeFileSync('database.json', JSON.stringify(fileList));

            fs.writeFile(directoryPath, fileInfo.content, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            })
            res.writeHead(200);
            res.end();
        });
    }
    else if (req.url === '/getAllFiles' && req.method === 'GET') {
        //procitati fajlove iz files i poslati ih na client side
        res.writeHead(200);
        res.end(JSON.stringify(fileList));
    }
    else if (req.method == 'OPTIONS') {
        res.writeHead(200);
        res.end();
    }
}).listen(port, () => {
    console.log(`Hello world app listening on port ${port}!`)
});


