let taskArr = [];

const ButtonsAppearance = () => {
    document.getElementById('InterfaceButtons').innerHTML = `
        <a onclick="completeAllTasks(), animationReverse()"  class='buttons' >Complete all tasks</a>
        <a class='buttons' onclick='deleteCompletedTasks(), animationReverse()' >Delete completed tasks</a>
        <a class='buttons' onclick='deleteAllTasks(), animationReverse()' >Delete all tasks</a>
      `;
    document.getElementById('buttons').remove();
    document.getElementById('InterfaceButtons').classList.add('animation');
    document.getElementById('InterfaceButtons').addEventListener('animationend', animationDelete);
    document.getElementById('InterfaceButtons').addEventListener('animationend', mouseout);
}

const mouseout = () => {
    document.getElementById('InterfaceButtons').addEventListener('mouseleave', animationReverse);
}

const animationDelete = () => {
    document.getElementById('InterfaceButtons').classList.remove('animation', 'animationReverse');
}

const animationReverse = () => {
    document.getElementById('InterfaceButtons').classList.add('animationReverse', 'animation');
    document.getElementById('InterfaceButtons').addEventListener('animationend', ButtonsDisappearance);
}

const ButtonsDisappearance = () => {
    document.getElementById('interface').innerHTML = `
    <input class='interfaceInput' id="interfaceInput" placeholder='Enter your task' type='text' onkeyup="addTaskByEnter(event)"/>
     <a class='buttons' onclick='addToArray(), addToIndex()'">ADD</a>
    <a class='buttons' id='buttons' onclick='ButtonsAppearance()' onmouseover='ButtonsAppearance()'>Buttons</a>
    <div class='interfaceButtons' id='InterfaceButtons'>
    </div>
    `;
}

addTaskByEnter = (event) => {
    if (event.keyCode === 13) {
        addToArray();
        addToIndex();
    }
}

completeAllTasks = () => {
    for (let i = 0; i < taskArr.length; i++) {
        taskArr[i].status = true;
    }
    localStorage.arr = JSON.stringify(taskArr);
    addToIndex();
}

deleteAllTasks = () => {
    document.getElementById('tasks').innerHTML = '';
    taskArr = [];
    localStorage.arr = JSON.stringify(taskArr);
}

const deleteCompletedTasks = () => {
    for (let i = 0; i < taskArr.length; i++) {
        if (taskArr[i].status) {
            taskArr.splice(i, taskArr.length - i);
            break;
        }
    }
    localStorage.arr = JSON.stringify(taskArr);
    addToIndex();
}

const addToArray = () => {
    taskArr.unshift({
        taskId: Date.now(),
        name: document.getElementById('interfaceInput').value,
        status: false,
        date: goodDate()
    });
    document.getElementById('interfaceInput').value = '';
    localStorage.arr = JSON.stringify(taskArr);
}

const addToIndex = () => {
    document.getElementById('tasks').innerHTML = '';
    for (let i = 0; i < taskArr.length; i++) {
        if (isRightName(taskArr[i].name)) {
            document.getElementById('tasks').innerHTML += `
    <div class='task' id=${taskArr[i].taskId}>
        <p class='nameTask' id='name${taskArr[i].taskId}'></p>
        <div class='taskButtons'>
        <a id='complete${taskArr[i].taskId}' onclick="taskComplete(${taskArr[i].taskId})">Complete</a>
        <a onclick="Delete(${taskArr[i].taskId})">Delete</a>
        <p class="date">${taskArr[i].date}</p>
        </div>  
    </div>`;
            document.getElementById(`name${taskArr[i].taskId}`).innerHTML = taskArr[i].name;
            if (taskArr[i].status) {
                document.getElementById(`${taskArr[i].taskId}`).style.backgroundColor = '#ADA7A7FF';
                document.getElementById(`name${taskArr[i].taskId}`).style.backgroundColor = '#ADA7A7FF';
                document.getElementById(`complete${taskArr[i].taskId}`).innerHTML = 'Completed';
                document.getElementById(`complete${taskArr[i].taskId}`).style.backgroundColor = 'green';
            }
        }
    }
}

const taskComplete = (id) => {
    for (let i = 0; i < taskArr.length; i++) {
        if (`${taskArr[i].taskId}` === `${id}`) {
            taskArr[i].status = !(taskArr[i].status);
            taskArr[i].date = `${goodDate()}`;
            localStorage.arr = JSON.stringify(taskArr);
            if (taskArr[i].status) {
                taskArr.push(taskArr[i]);
                taskArr.splice(i, 1);
            } else {
                taskArr.unshift(taskArr[i]);
                taskArr.splice(i + 1, 1);
            }
            break;
        }
    }
    addToIndex();
}

const Delete = (id) => {
    for (let i = 0; i < taskArr.length; i++) {
        if (`${taskArr[i].taskId}` === `${id}`) {
            taskArr.splice(i, 1);
            localStorage.arr = JSON.stringify(taskArr);
        }
    }
    addToIndex();
}

const isRightName = (name) => {
    if (name === '') {
        return false;
    } else {
        return true;
    }
}

const goodDate = () => {
    let month, day, date = new Date();
    month = date.getMonth();
    day = date.getDate();
    if (month <= 9) {
        month = '0' + month;
    }
    if (day <= 9) {
        day = '0' + day;
    }
    return day + '.' + month + '.' + date.getFullYear();
}

window.onload = function () {
    taskArr  = JSON.parse(localStorage.arr);
    addToIndex();
};