function onLoad(){
 //displayFiles();
}
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
    const fileInfo = {
        title: document.getElementById('title').value,
        ccontent: document.getElementById('content').value,
    };

    xhttp.open('POST', 'http://localhost:8080/files/addNewFile');
    //xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhttp.send(JSON.stringify(fileInfo));
    close();
}
/*function  displayFiles(){
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `http://localhost:8080/files/getAllFiles`);
    xhttp.send();
    let allFiles = JSON.parse(xhttp.responseText);
    xhttp.onreadystatechange =function (){
        if(this.readyState ==4 && this.status== 200){
        console.log(allFiles);
      }
    }

    
}*/