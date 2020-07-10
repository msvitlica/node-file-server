const http = require('http');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const PORT = 3000;

const server = http.createServer((req, res) => {
    const { method, url } = req;
    if (method === 'GET') {
        const header = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Method': 'OPTIONS, POST, GET, PUT, DELETE',
            'Access-Control-Max-Age': 2592000
        }
        let dirPath = path.join(__dirname, 'files');
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                return console.log(err);
            }
            res.writeHead(200, header);
            res.write(JSON.stringify(files));
            res.end();
        });
    }
    if (method === 'POST') {
        let body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            let data = JSON.parse(body);
            fs.writeFile(path.join(__dirname, '/files', `${data.name}.txt`), `${data.content}`, err => {
                if (err) throw err;
                console.log('Files written to...');
            })
            res.end('File added...');
        });
    }

});

server.listen(PORT, console.log(`Server running on port ${PORT}.`));