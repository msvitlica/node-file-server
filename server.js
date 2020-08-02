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
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', req.headers.origin);

    //GET ALL FILES 
    if (req.url === '/getAllFiles' && req.method === 'GET') {
        res.writeHead(200, header);
        res.end(JSON.stringify(fileList));
    }
    else if (req.method == 'OPTIONS') {
        res.writeHead(200);
        res.end();
    }
      // GET BY ID
   if(req.url=== url.parse(req.url, true).pathname && req.method === 'GET'){
    let body = [];
    let pathName = url.parse(req.url, true).pathname;
   let fileId = pathName.replace('/get/', '');
   let directoryPath = path.join(__dirname, '/files', fileId);
 let foundedFile= fileList.filter(el=> el.id=== fileId)[0];
console.log(directoryPath);
res.end(JSON.stringify(foundedFile));


}
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
                console.log('The file ' + fileData.id + ' has been saved!');
            })
            res.writeHead(200, header);
            res.end();
        });
    }
    // PUT
     else if (req.method === 'PUT' && req.url === url.parse(req.url, true).pathname){
    let body=[];
    let pathName = url.parse(req.url, true).pathname;
    let directoryPath = path.join(__dirname, '/files',pathName);
    console.log(directoryPath);
    req.on('data',(chunk)=>{
        body.push(chunk);
    }).on('end',()=>{
        let fileInfo = JSON.parse(body);
     let editedFile=fileList.filter(el=>el.id ==fileInfo.id)[0];
     editedFile.title=fileInfo.title;
     editedFile.content= fileInfo.content;
    fileList =fileList.map(el => el.id !== editedFile.id ? el : editedFile);
    fs.writeFileSync('database.json', JSON.stringify(fileList));
    fs.writeFile(directoryPath, editedFile.content ,(err) => {
        if (err) throw err;
        console.log('The file  has been updated!');
    });
     res.writeHead(200, header);
            res.end();
        
    })
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
        });
         let delFile=fileList.filter(el =>(el.id !== fileId));
         fs.writeFileSync('database.json', JSON.stringify(delFile));
         fileList=delFile;
        console.log(fileList);
        console.log('File deleted!');
        res.end();
         
    }
}).listen(port, () => {
    console.log(`Hello world app listening on port ${port}!`)
});


