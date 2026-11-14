const inputbox = document.getElementById("inputtxt");
const form = document.getElementById("inputbox");
const tasklist = document.getElementById("tasklist");

function additem() {
    if (inputbox.value.trim() === "") {
        alert("You must write something");
        return;
    }
    let li = document.createElement("li");
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    let tasktext = document.createElement("span");
    tasktext.textContent = inputbox.value;
    tasktext.className = "task-text";
    let btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.className = "delete-btn";
    li.appendChild(checkbox);
    li.appendChild(tasktext);
    li.appendChild(btn);
    tasklist.appendChild(li);
    inputbox.value = "";
    storage();
}
tasklist.addEventListener("change", function(event) {
    if (event.target.classList.contains("task-checkbox")) {
        event.target.nextElementSibling.classList.toggle(
            "checked",
            event.target.checked
        );
        storage();
    }
});
tasklist.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-btn")) {
        event.target.parentElement.remove();
        storage();
    }
});
form.addEventListener("submit", function(event) {
    event.preventDefault();
    additem();
});
tasklist.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-btn")) {
        event.target.parentElement.remove();
    } else if (event.target.tagName === "LI") {
        event.target.classList.toggle("checked");
    }
    storage();
});
function storage() {
    localStorage.setItem("data", tasklist.innerHTML);
}
function showdata() {
    tasklist.innerHTML = localStorage.getItem("data") || "";
}
showdata();
