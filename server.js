const http = require('http');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const URL = require('url').URL;
const header = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Max-Age': 2592000
}

const PORT = 3000;

const server = http.createServer((req, res) => {
    const { method, url } = req;

    // Create path to files
    let fileDirPath = path.join(__dirname, 'files');

    const myURL = new URL('http://' + req.headers.host + url);
    
    // Response with all files
    if (url === '/' && method === 'GET') {
        let files = [];
        fs.readdir(fileDirPath, (err, dirId) => {
            if (err) {
                return console.log(err);
            }
            dirId.forEach(dir => {
                let name = fs.readdirSync(path.join(fileDirPath, dir))[0];
                let fileStats = fs.statSync(path.join(fileDirPath, dir, name));
                let obj = {
                    id: dir,
                    name: name,
                    size: fileStats.size / 1000
                }
                files.push(obj);
            });
            res.writeHead(200, header);
            res.write(JSON.stringify(files));
            res.end();
        });
    }

    // Writes new file to dir
    else if (method === 'POST') {
        let body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            let data = JSON.parse(body);
            let dirId = path.join(fileDirPath, uuid.v4().toString());
            fs.mkdir(dirId, (err) => {
                if (err) throw err;
                console.log('Directory added...');
            });
            fs.writeFile(path.join(dirId, `${data.name}.txt`), `${data.content}`, err => {
                if (err) throw err;
                console.log('Files written to...');
            })
            res.end('File added...');
        });
    }

    // Response with sepecific file
    else if (url === myURL.pathname && method === 'GET') {
        let dirPath = path.join(__dirname, myURL.pathname);
        fs.readdir(dirPath, (err, file) => {
            if (err) return console.log(err);
            fs.readFile(path.join(dirPath, file[0]), 'utf8', (err, data) => {
                if (err) {
                    return console.log(err);
                }
                res.writeHead(200, header);
                res.write(JSON.stringify({
                    id: myURL.pathname.replace('/files/', ''),
                    name: file[0].replace('.txt', ''),
                    content: data
                }))
                res.end();
            });
        });
    }
    else if (method === 'OPTIONS') {
        res.writeHead(200, header);
        res.end();
    }

    // Change file on server
    else if (url === myURL.pathname && method === 'PUT') {
        let body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            let data = JSON.parse(body);
            let dirId = path.join(fileDirPath, `/${data.id}`);
            fs.readdir(dirId, (err, file) => {
                fs.writeFile(path.join(dirId, file[0]), `${data.content}`, err => {
                    if (err) throw err;
                    console.log('Files written to...');
                });
                fs.rename(path.join(dirId, file[0]), path.join(dirId, `${data.name}.txt`), (err) => {
                    if (err) return console.log(err);
                    console.log('File renamed...');
                });
                res.writeHead(200, header);
                res.write('File renamed!');
                res.end();
            });
        });
    }

    // Delete specific file
    else if (url === myURL.pathname && method === 'DELETE') {
        let dirPath = path.join(fileDirPath, myURL.pathname);
        fs.readdir(dirPath, (err, file) => {
            if (err) return console.log(err);
            fs.unlink(path.join(dirPath, file[0]), (err) => {
                if (err) return console.log(err);
                console.log('File Deleted!');
            });
            fs.rmdir(dirPath, err => {
                if (err) {
                    return console.log(err);
                }
                res.writeHead(200, header);
                res.write('File Deleted!');
                res.end();
            });
        })
    }
});

server.listen(PORT, console.log(`Server running on port ${PORT}.`));
