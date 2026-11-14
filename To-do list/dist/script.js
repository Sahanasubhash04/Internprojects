"use strict";
// 3. GENERIC FUNCTION
function getElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`Element not found: ${selector}`);
    }
    return element;
}
// 4. HTML ELEMENT TYPES
const inputbox = getElement("#inputtxt");
const form = getElement("#inputbox");
const tasklist = getElement("#tasklist");
// Task array
let tasks = [];
// Save tasks
function storage() {
    localStorage.setItem("data", JSON.stringify(tasks));
}
// Display tasks
function renderTasks() {
    tasklist.innerHTML = "";
    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.dataset.id = String(task.id);
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.status === "completed";
        const tasktext = document.createElement("span");
        tasktext.textContent = task.text;
        tasktext.className = "task-text";
        if (task.status === "completed") {
            tasktext.classList.add("checked");
        }
        const btn = document.createElement("button");
        btn.textContent = "Delete";
        btn.className = "delete-btn";
        btn.type = "button";
        li.appendChild(checkbox);
        li.appendChild(tasktext);
        li.appendChild(btn);
        tasklist.appendChild(li);
    });
}
// Add a task
function additem() {
    const taskName = inputbox.value.trim();
    if (taskName === "") {
        alert("You must write something");
        return;
    }
    const newTask = {
        id: Date.now(),
        text: taskName,
        status: "pending"
    };
    tasks.push(newTask);
    inputbox.value = "";
    storage();
    renderTasks();
}
// Complete or uncomplete a task
tasklist.addEventListener("change", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement &&
        target.classList.contains("task-checkbox")) {
        const li = target.closest("li");
        const taskId = Number(li === null || li === void 0 ? void 0 : li.dataset.id);
        const task = tasks.find(item => item.id === taskId);
        if (task) {
            task.status = target.checked ? "completed" : "pending";
        }
        storage();
        renderTasks();
    }
});
// Delete a task
tasklist.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLButtonElement &&
        target.classList.contains("delete-btn")) {
        const li = target.closest("li");
        const taskId = Number(li === null || li === void 0 ? void 0 : li.dataset.id);
        tasks = tasks.filter(task => task.id !== taskId);
        storage();
        renderTasks();
    }
});
// Form submission
form.addEventListener("submit", (event) => {
    event.preventDefault();
    additem();
});
// Load saved tasks
function showdata() {
    const savedData = localStorage.getItem("data");
    if (savedData) {
        try {
            tasks = JSON.parse(savedData);
        }
        catch (_a) {
            tasks = [];
        }
    }
    renderTasks();
}
showdata();
