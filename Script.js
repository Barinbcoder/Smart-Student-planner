let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let animatingIndex = null;

const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const toggleBtn = document.getElementById("toggleMode");

/* SAVE */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ADD TASK */
addBtn.addEventListener("click", () => {
  const text = taskInput.value;
  const date = dateInput.value;

  if (!text || !date) return;

  tasks.push({
    text,
    date,
    completed: false
  });

  saveTasks();
  renderTasks();

  taskInput.value = "";
  dateInput.value = "";
});

/* TOGGLE TASK */
function toggleTask(index) {
  animatingIndex = index;

  tasks[index].completed = !tasks[index].completed;

  saveTasks();
  renderTasks();

  setTimeout(() => {
    animatingIndex = null;
  }, 300);
}

/* DELETE TASK */
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

/* RENDER */
function renderTasks() {
  taskList.innerHTML = "";

  // SORT by date
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    // Due logic
    const today = new Date();
    const dueDate = new Date(task.date);

    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status = "";
    if (diffDays < 0) status = "Overdue ⚠️";
    else if (diffDays === 0) status = "Due Today";
    else if (diffDays === 1) status = "Due Tomorrow";
    else status = `Due in ${diffDays} days`;

    // Styles
    if (task.completed) li.classList.add("completed");
    if (index === animatingIndex) li.classList.add("checking");

    li.innerHTML = `
      <div>
        <strong>${task.text}</strong><br>
        <small>${status}</small>
      </div>
      <div>
        <button onclick="toggleTask(${index})">✔</button>
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

/* DARK MODE */
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

/* LOAD DARK MODE */
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

/* INITIAL LOAD */
renderTasks();
