const http = require('http');
const fs = require('fs');
const path = require('path');
const URL = require('url').URL;

const PORT = 3000;

const server = http.createServer((req, res) => {
    const { method } = req;
    console.log(method);
    const myURL = new URL(req.headers.host + req.url);
    // Response with all files
    if (req.url === '/' && method === 'GET') {
        const header = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
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

    // Writes new file to dir
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

    // Response with sepecific file
    else if (req.url === `/search${myURL.search}` && method === 'GET') {
        const searchedFile = myURL.searchParams.get('fileName');
        const header = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Control-Max-Age': 2592000
        }
        let dirPath = path.join(__dirname, 'files', searchedFile);
        fs.readFile(dirPath, 'utf8', (err, data) => {
            if (err) {
                return console.log(err);
            }
            res.writeHead(200, header);
            res.write(JSON.stringify({
                name: searchedFile.replace('.txt', ''),
                content: data
            }))
            res.end();
        });;
    }
    else if (method === 'OPTIONS'){
        const header = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Control-Max-Age': 2592000
        }
        res.writeHead(200, header);
        res.end();
    }

    // Delete specific file
    else if (req.url === `/delete${myURL.search}` && method === 'DELETE') {
        const searchedFile = myURL.searchParams.get('fileName');
        const header = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Control-Max-Age': 2592000
        }
        let dirPath = path.join(__dirname, 'files', searchedFile);
        fs.unlink(dirPath, err => {
            if (err) {
                return console.log(err);
            }
            res.writeHead(200, header);
            res.write('File Deleted!');
            res.end();
        });
    }
});

server.listen(PORT, console.log(`Server running on port ${PORT}.`));
