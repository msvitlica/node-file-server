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

    //console.log(queryObj);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', req.headers.origin);
    // POST
    if (req.method === 'POST' && req.url === '/addNewFile') {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            const fileInfo = JSON.parse(body);
            const fileData = {
                id: uuid.v4(),
                title: fileInfo.title,
                content: fileInfo.content,
                fileSize: 'velicina fajla',

            }
            fileList.push(fileData);
            const directoryPath = path.join(__dirname, '/files', fileData.id);
            fs.writeFileSync('database.json', JSON.stringify(fileList));
            fs.writeFile(directoryPath, fileInfo.content, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            })
            res.writeHead(200, header);
            res.end();
        });
    }
    // PUT
    /* else if (req.method === 'PUT' && req.url === '/:id'){
 let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            const fileInfo = JSON.parse(body);
    }
    // GET BY ID
    else if(req.url=== '/:id' && req.method=== 'GET'){

    }*/
    //GET ALL FILES 
    else if (req.url === '/getAllFiles' && req.method === 'GET') {
        res.writeHead(200, header);
        res.end(JSON.stringify(fileList));
    }
    else if (req.method == 'OPTIONS') {
        res.writeHead(200);
        res.end();
    }
    // DELETE
    else if (req.url === url.parse(req.url, true).pathname && req.method === 'DELETE') {
        let pathName = url.parse(req.url, true).pathname;
        let fileId = pathName.replace('/', '');
        //console.log(fileId);
        //console.lo(pathName);
        let directoryPath = path.join(__dirname, '/files', pathName);
        fs.unlinkSync(directoryPath, (err) => {
            if (err) console.log(err);
            return console.log('File Deleted!');
        });
         let delFile=fileList.filter(el =>(el.id !== fileId));
         fs.writeFileSync('database.json', JSON.stringify(delFile));
         fileList=delFile;
        console.log(fileList);
        res.end();
         
    }
}).listen(port, () => {
    console.log(`Hello world app listening on port ${port}!`)
});


