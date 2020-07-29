function onLoad(){
    displayFiles(file);
;
}
let file={};
function openDialog() {
    document.getElementById('addNewsDialog').style.display = 'block';
}
function closeDialog() {
    document.getElementById('addNewsDialog').style.display = 'none';
}

function close() {
    document.getElementById('addNewsDialog').style.display = 'none';
    deleteInputFields();
}

function deleteInputFields() {
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
}
function saveFile() {
    const xhttp = new XMLHttpRequest();
    let title=document.getElementById('title').value;
    let content=document.getElementById('content').value; 
    
   if (file.id) {
       file={
        title: file.title,
        content:file.content,
       }
        xhttp.open('PUT', `http://localhost:8081/${file.id}`);
        xhttp.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
        xhttp.send(JSON.stringify(file));
        file={};
    }
    else {
        file = {
            title: title,
            content: content,
        }
        xhttp.open('POST', 'http://localhost:8081/addNewFile');
        xhttp.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
        xhttp.send(JSON.stringify(file));
        file={};
    close();
    onLoad();
}
}
// delete file
function onDeleteBtn(id){
    const xhttp = new XMLHttpRequest();
    xhttp.open('DELETE',`http://localhost:8081/${id}`);
    xhttp.send();

}
function  displayFiles(x){ 
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'http://localhost:8081/getAllFiles');
    xhttp.send();
    xhttp.onreadystatechange =function (){
        if(this.readyState ==4 && this.status== 200){
    let allFiles = JSON.parse(xhttp.responseText);
    console.log(allFiles);
    const table =document.getElementById('fileTable');
    clearHtmlTable(table) ;
        allFiles.forEach(file=>{
        const row=table.insertRow();
        const cell1= row.insertCell();
        const cell2= row.insertCell();
        const cell3= row.insertCell();
        cell1.innerHTML=file.title; 
        cell2.innerHTML=  `<a href="#" id= "modifyFile${file.id}">Izmjeni</a> | <a href="#" id= "deleteFile${file.id}">Obriši</a>`
        cell3.innerHTML= file.fileSize;
        //const modifyBtn = document.getElementById(`modifyFile${el.id}`);
        const deleteBtn = document.getElementById(`deleteFile${file.id}`);
        //modifyBtn.addEventListener('click', () => { onModifyBtn(el.id)});
        deleteBtn.addEventListener('click', () => { onDeleteBtn(file.id)});
        });
      }
    }
}
function clearHtmlTable(table) {
   // const table=document.getElementById('fileTable');
   while (table.length > 1) {
    table.removeChild(table.lastChild());
}
}