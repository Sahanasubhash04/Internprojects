
// 1. INTERFACE
interface Task {
    id: number;
    text: string;
    status: TaskStatus;
}

// 2. TYPE ALIAS
type TaskStatus = "pending" | "completed";

// 3. GENERIC FUNCTION
function getElement<T extends HTMLElement>(selector: string): T {
    const element = document.querySelector<T>(selector);

    if (!element) {
        throw new Error(`Element not found: ${selector}`);
    }

    return element;
}

// 4. HTML ELEMENT TYPES
const inputbox = getElement<HTMLInputElement>("#inputtxt");
const form = getElement<HTMLFormElement>("#inputbox");
const tasklist = getElement<HTMLUListElement>("#tasklist");

// Task array
let tasks: Task[] = [];

// Save tasks
function storage(): void {
    localStorage.setItem("data", JSON.stringify(tasks));
}

// Display tasks
function renderTasks(): void {
    tasklist.innerHTML = "";

    tasks.forEach((task: Task) => {
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
function additem(): void {
    const taskName = inputbox.value.trim();

    if (taskName === "") {
        alert("You must write something");
        return;
    }

    const newTask: Task = {
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
tasklist.addEventListener("change", (event: Event): void => {
    const target = event.target;

    if (
        target instanceof HTMLInputElement &&
        target.classList.contains("task-checkbox")
    ) {
        const li = target.closest("li");
        const taskId = Number(li?.dataset.id);

        const task = tasks.find(item => item.id === taskId);

        if (task) {
            task.status = target.checked ? "completed" : "pending";
        }

        storage();
        renderTasks();
    }
});

// Delete a task
tasklist.addEventListener("click", (event: MouseEvent): void => {
    const target = event.target;

    if (
        target instanceof HTMLButtonElement &&
        target.classList.contains("delete-btn")
    ) {
        const li = target.closest("li");
        const taskId = Number(li?.dataset.id);

        tasks = tasks.filter(task => task.id !== taskId);

        storage();
        renderTasks();
    }
});

// Form submission
form.addEventListener("submit", (event: SubmitEvent): void => {
    event.preventDefault();
    additem();
});

// Load saved tasks
function showdata(): void {
    const savedData = localStorage.getItem("data");

    if (savedData) {
        try {
            tasks = JSON.parse(savedData) as Task[];
        } catch {
            tasks = [];
        }
    }

    renderTasks();
}

showdata();
