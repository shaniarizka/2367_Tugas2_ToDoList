document.addEventListener("DOMContentLoaded", function () {
    loadTodos();
});

let editIndex = null;

function addOrUpdateTodo() {
    let input = document.getElementById("todoInput");
    let task = input.value.trim();
    if (task === "") return;

    if (editIndex !== null) {
        document.querySelectorAll("#todoList li")[editIndex].querySelector("span").textContent = task;
        editIndex = null;
        document.getElementById("addButton").textContent = "Add";
    } else {
        let todoList = document.getElementById("todoList");
        let li = createTodoElement(task, false);
        todoList.appendChild(li);
    }

    input.value = "";
    saveTodos();
    updateStats();
}

function createTodoElement(task, completed) {
    let li = document.createElement("li");
    li.className = "flex items-center justify-between p-2 rounded todo-item"; // Tambahkan "todo-item"

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.className = "mr-2";
    checkbox.addEventListener("change", function () {
        let text = li.querySelector("span");
        if (checkbox.checked) {
            text.classList.add("line-through", "text-gray-500");
            moveToBottom(li);
        } else {
            text.classList.remove("line-through", "text-gray-500");
            moveToTop(li);
        }
        saveTodos();
        updateStats();
    });

    let text = document.createElement("span");
    text.textContent = task;
    if (completed) {
        text.classList.add("line-through", "text-gray-500");
    }

    let buttonContainer = document.createElement("div");

    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "bg-wave text-white px-3 py-1 rounded mr-2 hover:bg-ocean";
    editButton.addEventListener("click", function () {
        document.getElementById("todoInput").value = text.textContent;
        document.getElementById("addButton").textContent = "Update";
        editIndex = Array.from(li.parentNode.children).indexOf(li);
    });

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "bg-deep-aqua text-white px-3 py-1 rounded hover:bg-ocean";
    deleteButton.addEventListener("click", function () {
        li.remove();
        saveTodos();
        updateStats();
    });

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);
    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(buttonContainer);

    return li;
}

function moveToBottom(element) {
    let todoList = document.getElementById("todoList");
    todoList.appendChild(element);
}

function moveToTop(element) {
    let todoList = document.getElementById("todoList");
    todoList.prepend(element);
}

function saveTodos() {
    let todos = [];
    document.querySelectorAll("#todoList li").forEach(li => {
        let task = li.querySelector("span").textContent;
        let completed = li.querySelector("input").checked;
        todos.push({ task, completed });
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    let todoList = document.getElementById("todoList");

    todos.forEach(({ task, completed }) => {
        let li = createTodoElement(task, completed);
        todoList.appendChild(li);
    });

    updateStats();
}

function updateStats() {
    let total = document.querySelectorAll("#todoList li").length;
    let completed = document.querySelectorAll("#todoList li input:checked").length;
    let uncompleted = total - completed;
    document.getElementById("todoStats").textContent = `Complete: ${completed} | Uncomplete: ${uncompleted}`;
}
