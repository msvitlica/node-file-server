const createFileBtn = document.getElementById('createFile');
const closeModalBtn = document.getElementById('closeModal');
const addFileBtn = document.getElementById('addFile');

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

    cell1.innerHTML = file;
    cell2.innerHTML = `<a href="#" id="modify${file}">Izmjeni</a> | <a href="#" id="delete${file}">Obriši</a>`;

    const modifyBtn = document.getElementById(`modify${file}`);
    const deleteBtn = document.getElementById(`delete${file}`);

    modifyBtn.addEventListener('click', () => { onModifyBtn(file) });
    deleteBtn.addEventListener('click', () => { onDeleteBtn(file) });
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

    let newFile = {
        name: fileName.value,
        content: content.value
    }

    xhttp.open('POST', 'http://localhost:3000');
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhttp.send(JSON.stringify(newFile));

    onCloseModal();
    clearInput();
    onLoad();
}

function onModifyBtn(fileName) {
    let xhttp = new XMLHttpRequest();
    let file;

    xhttp.open('GET', `http://localhost:3000/search?fileName=${fileName}`);
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

function onDeleteBtn(fileName) {
    let xhttp = new XMLHttpRequest();

    xhttp.open('DELETE', `http://localhost:3000/delete?fileName=${fileName}`);
    xhttp.send();
}