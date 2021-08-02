let list = [];
let RootDiv = document.getElementById('root');

window.onload = function () {
    oldlist = JSON.parse(localStorage.getItem('task'));
    if (oldlist != null) {
        oldlist.forEach((item) => {
            displayonDOM(createDiv(item.taskid, item.description, item.isChecked));
        });
        list = oldlist.slice();
        oldlist = [];
    }
    return;
};

const updatelocalStorage = () => {
    localStorage.setItem('task', JSON.stringify(list));
}


function Task(description) {
    this.taskid = uuidv4();
    this.description = description;
    this.isChecked = false;
}

let addTask = document.getElementById("add");

let resetTask = document.getElementById("reset");

resetTask.addEventListener('click', event => {
    taskDescription.value = "";
});

let taskDescription = document.getElementById("task-description");

const validateDescription = (input) => {
    if (!(input.trim() === "")) {
        return input.trim();
    }
    else
        alert("Invalid Input");
    throw new Error('Invalid String');
};

const deleteTask = (TaskID) => {
    const index = list.findIndex(obj => {
        return obj.taskid === TaskID;
    });
    list.splice(index, 1);
    updatelocalStorage();

    let tobedeleted = document.getElementById(TaskID);
    RootDiv.removeChild(tobedeleted);
};

const editTask = (TaskID) => {
    let tobeedited = document.getElementById(TaskID);
    let editButton = tobeedited.children[3];
    editButton.style.display = "none";
    let doneButton = tobeedited.children[4];
    doneButton.style.display = "block";

    let inputField = tobeedited.children[2];
    inputField.disabled = false;

    doneButton.addEventListener('click', event => {
        let validDescription = validateDescription(inputField.value);

        const index = list.findIndex(obj => {
            return obj.taskid === TaskID;
        });

        list[index].description = validDescription;
        updatelocalStorage();
        editButton.style.display = "block";
        doneButton.style.display = "none";
        inputField.disabled = true;

    });

};

const onCheck = (TaskID, inputField) => {
    let tobechecked = document.getElementById(TaskID);
    let editButton = tobechecked.children[3];
    editButton.disabled = editButton.disabled === true ? false : true;

    const index = list.findIndex(obj => {
        return obj.taskid === TaskID;
    });

    list[index].isChecked = !(list[index].isChecked);
    list[index].isChecked ? inputField.classList.add("strikethrough") : inputField.classList.remove("strikethrough");
    updatelocalStorage();
}


const createDiv = (taskid, description, isChecked) => {

    let createTask = document.createElement("div");
    createTask.id = taskid;
    createTask.classList.add("display-task");

    let createText = document.createElement("input");
    createText.type = 'text';
    createText.id = `${taskid}input`;
    createText.value = description;
    createText.disabled = true;

    let createCheck = document.createElement("input");
    createCheck.type = 'checkbox';
    createCheck.addEventListener('click', event => {
        onCheck(taskid, createText);
    });

    createTask.appendChild(createCheck);

    let checkboxicon = document.createElement("i");
    createTask.appendChild(checkboxicon);

    createTask.appendChild(createText);


    let createEdit = document.createElement("button");
    createEdit.addEventListener('click', event => {
        createText.disabled = false;
        editTask(taskid);

    });
    let createEditIcon = document.createElement("i");
    createEditIcon.classList.add("far", "fa-edit");
    createEdit.appendChild(createEditIcon);
    createTask.appendChild(createEdit);

    let createDone = document.createElement("button");
    createDone.style.display = "none";
    let createDoneIcon = document.createElement("i");
    createDoneIcon.classList.add("fa", "fa-thumbs-up");
    createDone.appendChild(createDoneIcon);
    createTask.appendChild(createDone);

    let createDelete = document.createElement("button");
    createDelete.addEventListener('click', event => {
        deleteTask(taskid);
    });
    let createDeleteIcon = document.createElement("i");
    createDeleteIcon.classList.add("fas", "fa-trash");
    createDelete.appendChild(createDeleteIcon);
    createTask.appendChild(createDelete);
    if (isChecked === true) {
        createText.classList.add('strikethrough');
        createCheck.checked = true;
        createEdit.disabled = true;
    }
    return createTask;
};

const displayonDOM = (markup) => RootDiv.appendChild(markup);

taskDescription.addEventListener('keypress', event => {
    if (event.keyCode === 13) {
        event.preventDefault();
        addTask.click();
    }
})

addTask.addEventListener('click', event => {
    let validatedInput = validateDescription(taskDescription.value);

    let task = new Task(validatedInput);
    list.push(task);
    taskDescription.value = "";
    updatelocalStorage();
    displayonDOM(createDiv(task.taskid, task.description, task.isChecked));
});