"use strict";

const EMPTY_MESSAGE = "Task cannot be empty";

const SAMPLE_TASKS = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];

let taskCounter = 0;

function generateTaskId() {
  let id;
  do {
    taskCounter += 1;
    id = `task-${taskCounter}`;
  } while (document.querySelector(`[data-task-id="${id}"]`));
  return id;
}

function createTaskData(text) {
  return { id: generateTaskId(), text: text.trim(), state: "pending" };
}

const dom = {
  taskInput: document.getElementById("taskInput"),
  addTaskBtn: document.getElementById("addTaskBtn"),
  loadSamplesBtn: document.getElementById("loadSamplesBtn"),
  taskList: document.getElementById("taskList"),
  taskMessage: document.getElementById("taskMessage"),
  totalCount: document.getElementById("totalCount"),
  pendingCount: document.getElementById("pendingCount"),
  completedCount: document.getElementById("completedCount")
};

const { taskInput, addTaskBtn, loadSamplesBtn, taskList } = dom;

function isBlank(text) {
  return text.trim() === "";
}

function showMessage(text) {
  dom.taskMessage.textContent = text;
}

function createButton(className, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add(className);
  button.textContent = label;
  return button;
}

function createTaskElement(taskText, taskId) {
  const li = document.createElement("li");
  li.classList.add("task-item");
  li.dataset.taskId = taskId;
  li.dataset.state = "pending";

  const span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = taskText;

  const buttons = [
    ["complete-btn", "Complete"],
    ["edit-btn", "Edit"],
    ["remove-btn", "Remove"]
  ].map(([className, label]) => createButton(className, label));

  li.append(span, ...buttons);
  return li;
}

function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted ? "completed" : "pending";
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const textSpan = taskItem.querySelector(".task-text");
  const editBtn = taskItem.querySelector(".edit-btn");
  if (!textSpan || !editBtn) return;

  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("edit-input");
  input.value = textSpan.textContent;
  input.setAttribute("aria-label", "Edit task");

  textSpan.replaceWith(input);
  editBtn.textContent = "Save";
  input.focus();
}

function saveTaskEdit(taskItem) {
  const input = taskItem.querySelector(".edit-input");
  const editBtn = taskItem.querySelector(".edit-btn");
  if (!input || !editBtn) return;

  if (isBlank(input.value)) {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = input.value.trim();

  input.replaceWith(span);
  editBtn.textContent = "Edit";
  showMessage("");
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

function updateTaskCounts() {
  const items = Array.from(taskList.querySelectorAll(".task-item"));
  const completed = items.filter((item) => item.dataset.state === "completed").length;

  dom.totalCount.textContent = items.length;
  dom.completedCount.textContent = completed;
  dom.pendingCount.textContent = items.length - completed;
}

function addTask(taskText) {
  if (isBlank(taskText)) {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const { id, text } = createTaskData(taskText);
  taskList.appendChild(createTaskElement(text, id));

  taskInput.value = "";
  showMessage("");
  updateTaskCounts();
}

function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest(".task-item");
  if (!taskItem || !taskList.contains(taskItem)) return;

  if (target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (target.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const fragment = document.createDocumentFragment();
  SAMPLE_TASKS.map(createTaskData).forEach(({ id, text }) => {
    fragment.appendChild(createTaskElement(text, id));
  });
  taskList.appendChild(fragment);
  showMessage("");
  updateTaskCounts();
}

taskList.addEventListener("click", handleTaskListClick);
addTaskBtn.addEventListener("click", () => addTask(taskInput.value));
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTask(taskInput.value);
});
loadSamplesBtn.addEventListener("click", loadSampleTasks);

updateTaskCounts();