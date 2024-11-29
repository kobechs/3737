document.getElementById('addTaskButton').addEventListener('click', addTask);
document.getElementById('addEventButton').addEventListener('click', addEvent);
document.getElementById('clearStorageButton').addEventListener('click', clearLocalStorage);

window.onload = function() {
    loadTasks();
    loadEvents();
};

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let events = JSON.parse(localStorage.getItem('events')) || [];


function addTask() {
    const taskInput = document.getElementById('taskInput').value;
    const priorityInput = document.getElementById('priorityInput').value;
    const deadlineInput = document.getElementById('deadlineInput').value;

    if (!taskInput || !deadlineInput) {
        alert("タスクと期限を入力してください");
        return;
    }

    const task = {
        name: taskInput,
        priority: priorityInput,
        deadline: deadlineInput,
        completed: false,
        progress: 0
    };

    tasks.push(task);
    saveTasks(); 
    displayTasks();
}


function displayTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.add(task.priority);

        li.innerHTML = `
            <span>${task.name} - 締切: ${task.deadline}</span>
            <button onclick="completeTask(${index})">完了</button><br>
            <label>進捗: <span id="progressText-${index}">${task.progress}%</span></label>
            <progress id="progressBar-${index}" value="${task.progress}" max="100"></progress><br>
            <button onclick="increaseProgress(${index})">進捗があった</button>
            <button onclick="decreaseProgress(${index})">少しつまずいた</button>
            <button onclick="deleteTask(${index})">削除</button>
        `;

        li.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            deleteTask(index);
        });

        if (task.completed) {
            li.classList.add('completed');
        }
        taskList.appendChild(li);
    });
}


function deleteTask(index) {
    if (confirm("このタスクを削除しますか？")) {
        tasks.splice(index, 1);
        saveTasks(); 
        displayTasks();
    }
}


function completeTask(index) {
    tasks[index].completed = true;
    saveTasks(); 
    displayTasks();
}


function increaseProgress(index) {
    tasks[index].progress = Math.min(tasks[index].progress + 5, 100); // 5%刻みで進捗度を増加
    saveTasks();
    updateTaskProgress(index);
}

function decreaseProgress(index) {
    tasks[index].progress = Math.max(tasks[index].progress - 5, 0); // 5%刻みで進捗度を減少
    saveTasks();
    updateTaskProgress(index);
}



function updateTaskProgress(index) {
    document.getElementById(`progressBar-${index}`).value = tasks[index].progress;
    document.getElementById(`progressText-${index}`).innerText = `${tasks[index].progress}%`;
}


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function loadTasks() {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    displayTasks();
}


function addEvent() {
    const eventDateInput = document.getElementById('eventDateInput').value;

    if (!eventDateInput) {
        alert("イベントの日付を入力してください");
        return;
    }

    const event = {
        date: eventDateInput,
        name: `検定・テスト: ${eventDateInput}`
    };

    events.push(event);
    saveEvents(); 
    displayEvents(); 
}

function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events)); // ローカルストレージに保存
}

function displayEvents() {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = ''; 

    events.forEach((event, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span id="eventName-${index}">${event.name}</span>
            <button onclick="editEvent(${index})">編集</button>
            <button onclick="deleteEvent(${index})">削除</button>
        `;
        eventList.appendChild(li);
    });
}


function completeTask(index) {
    tasks[index].completed = true;
    tasks[index].progress = 100; 
    saveTasks();
    displayTasks();
}

function displayTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.add(task.priority);

        li.innerHTML = `
            <span>${task.name} - 締切: ${task.deadline}</span>
            <button onclick="completeTask(${index})">完了</button><br>
            <label>進捗: <span id="progressText-${index}">${task.progress}%</span></label>
            <progress id="progressBar-${index}" value="${task.progress}" max="100"></progress><br>
            <button onclick="increaseProgress(${index})">進捗があった</button>
            <button onclick="decreaseProgress(${index})">少しつまずいた</button>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.innerText = '削除';
        deleteButton.addEventListener('click', function () {
            deleteTask(index);
        });
        li.appendChild(deleteButton);

        li.addEventListener('contextmenu', function (event) {
            event.preventDefault();
            deleteTask(index);
        });

        if (task.completed) {
            li.classList.add('completed');
        }
        taskList.appendChild(li);
    });
}


function editEvent(index) {
    const newName = prompt("新しいイベント名を入力してください", events[index].name);
    if (newName !== null && newName.trim() !== '') {
        events[index].name = newName;
        saveEvents();
        displayEvents();
    }
}


function deleteEvent(index) {
    if (confirm("このイベントを削除しますか？")) {
        events.splice(index, 1);
        saveEvents();
        displayEvents();
    }
}


function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}


function loadEvents() {
    events = JSON.parse(localStorage.getItem('events')) || [];
    displayEvents();
}


function clearLocalStorage() {
    const confirmation = confirm('本当にすべてのデータを削除してもいいですか？ この操作は取り消せません。');
    if (confirmation) {
        localStorage.clear();
        alert('すべてのデータが削除されました。');
        location.reload();
    }
}
