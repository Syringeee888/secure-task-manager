"use strict";

// ---- Cached DOM references ----
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const EMPTY_MESSAGE = "Task cannot be empty";
const SAMPLE_TASKS = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];

let taskCounter = 0;

// ---- Helpers ----
function generateTaskId() {
  taskCounter += 1;
  let id = "task-" + taskCounter;
  // Guarantee uniqueness even if an ID already exists in the DOM
  while (taskList.querySelector('[data-task-id="' + id + '"]')) {
    taskCounter += 1;
    id = "task-" + taskCounter;
  }
  return id;
}

function createButton(className, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add(className);
  button.textContent = label;
  return button;
}

function showMessage(text) {
  taskMessage.textContent = text;
}

// ---- Required functions ----

// Creates one task <li>; does NOT attach it to the list.
function createTaskElement(taskText, taskId) {
  const li = document.createElement("li");
  li.classList.add("task-item");
  li.dataset.taskId = taskId;
  li.dataset.state = "pending";

  const span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = taskText;

  li.append(
    span,
    createButton("complete-btn", "Complete"),
    createButton("edit-btn", "Edit"),
    createButton("remove-btn", "Remove")
  );
  return li;
}

function addTask(taskText) {
  const text = taskText.trim();
  if (text === "") {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const taskItem = createTaskElement(text, generateTaskId());
  taskList.appendChild(taskItem);

  taskInput.value = "";
  showMessage("");
  updateTaskCounts();
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

  const newText = input.value.trim();
  if (newText === "") {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = newText;

  input.replaceWith(span);
  editBtn.textContent = "Edit";
  showMessage("");
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

function updateTaskCounts() {
  const items = taskList.querySelectorAll(".task-item");
  let pending = 0;
  let completed = 0;

  items.forEach(function (item) {
    if (item.dataset.state === "completed") {
      completed += 1;
    } else {
      pending += 1;
    }
  });

  totalCount.textContent = items.length;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
}

// Single delegated click handler for all task actions.
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
  SAMPLE_TASKS.forEach(function (text) {
    fragment.appendChild(createTaskElement(text, generateTaskId()));
  });
  taskList.appendChild(fragment); // appended once
  showMessage("");
  updateTaskCounts();
}

// ---- Event wiring ----
taskList.addEventListener("click", handleTaskListClick); // the only listener on #taskList

addTaskBtn.addEventListener("click", function () {
  addTask(taskInput.value);
});

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") addTask(taskInput.value);
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

updateTaskCounts();