const createFileBtn = document.getElementById('createFile');
const closeModalBtn = document.getElementById('closeModal');
const addFileBtn = document.getElementById('addFile');
let file = {};

createFileBtn.addEventListener('click', onCreateFile);
closeModalBtn.addEventListener('click', onCloseModal);
addFileBtn.addEventListener('click', onAddFile);
window.addEventListener('load', onLoad);

function onLoad() {
    let xhttp = new XMLHttpRequest();
    let filesList;

    xhttp.open('GET', 'http://localhost:3000');
    xhttp.send();


    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            filesList = JSON.parse(xhttp.responseText);
            filesList.forEach(element => {
                fillTable(element);
            });
        }
    }
}

function fillTable(file) {
    let table = document.getElementById('filesListTable');
    clearHtmlTable(table);
    let row = table.insertRow();

    let cell1 = row.insertCell();
    let cell2 = row.insertCell();
    let cell3 = row.insertCell();

    cell1.innerHTML = file.name;
    cell2.innerHTML = `<a href="#" id="modify${file.id}">Izmjeni</a> | <a href="#" id="delete${file.id}">Obriši</a>`;
    cell3.innerHTML = file.size;

    const modifyBtn = document.getElementById(`modify${file.id}`);
    const deleteBtn = document.getElementById(`delete${file.id}`);

    modifyBtn.addEventListener('click', () => { onModifyBtn(file.id) });
    deleteBtn.addEventListener('click', () => { onDeleteBtn(file.id) });
}
function clearHtmlTable(table) {
    while (table.length > 1) {
        table.removeChild(table.lastChild());
    }
}
function clearInput() {
    document.getElementById('fileName').value = '';
    document.getElementById('fileContent').innerHTML = '';
}
function onCreateFile() {
    document.getElementById('myModal').style.display = "block";
}

function onCloseModal() {
    document.getElementById('myModal').style.display = "none";
    clearInput();
}

function onAddFile() {
    let xhttp = new XMLHttpRequest();

    const fileName = document.getElementById('fileName');
    const content = document.getElementById('fileContent');


    if (file.id) {
        xhttp.open('PUT', `http://localhost:3000/files/${file.id}`);
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhttp.send(JSON.stringify({
            id: file.id,
            name: fileName.value,
            content: content.value
        }));
    }
    else {
        xhttp.open('POST', 'http://localhost:3000');
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhttp.send(JSON.stringify({
            name: fileName.value,
            content: content.value
        }));
    }

    onCloseModal();
    clearInput();
    onLoad();
}

function onModifyBtn(fileId) {
    let xhttp = new XMLHttpRequest();

    xhttp.open('GET', `http://localhost:3000/files/${fileId}`);
    xhttp.send();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            file = JSON.parse(xhttp.responseText);

            onCreateFile();

            const fileName = document.getElementById('fileName');
            const content = document.getElementById('fileContent');

            fileName.value = file.name;
            content.innerHTML = file.content;
        }
    }
}

function onDeleteBtn(fileId) {
    let xhttp = new XMLHttpRequest();

    xhttp.open('DELETE', `http://localhost:3000/${fileId}`);
    xhttp.send();
}