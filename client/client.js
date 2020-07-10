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
    let row = document.getElementById('filesListTable').insertRow();

    let cell1 = row.insertCell();
    let cell2 = row.insertCell();

    cell1.innerHTML = file;
    cell2.innerHTML = 'Izmjeni | Obriši';
}
function onCreateFile() {
    document.getElementById('myModal').style.display = "block";
}

function onCloseModal() {
    document.getElementById('myModal').style.display = "none";
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
    onLoad();
}