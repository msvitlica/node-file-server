function onLoad(){
 displayFiles();
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
        content: document.getElementById('content').value,
    };

    xhttp.open('POST', 'http://localhost:8081/addNewFile');
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhttp.send(JSON.stringify(fileInfo));
    close();
    onLoad();
}
function  displayFiles(){
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `http://localhost:8081/getAllFiles`);
    xhttp.send();

    xhttp.onreadystatechange =function (){
        if(this.readyState ==4 && this.status== 200){
    let allFiles = JSON.parse(xhttp.responseText);
    console.log(allFiles);
        allFiles.reverse().forEach(el=>{
        const table=document.getElementById('fileTable');
        const row=table.insertRow();
        const cell1= row.insertCell();
        const cell2= row.insertCell();
        const cell3= row.insertCell();
        cell1.innerHTML=el.name;
        cell2.innerHTML=  `<a href="#" >Izmjeni</a> | <a href="#">Obriši</a>`
        cell3.innerHTML= 'velicina fajla';
        });
      }
    }

    
}