const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

async function createTask() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, startDate, endDate }),
  });

  await res.json();
  loadTasks();
}

async function loadTasks() {
  const res = await fetch(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const tasks = await res.json();
  const tasksDiv = document.getElementById("tasks");
  tasksDiv.innerHTML = "";

  let completed = 0;
  tasks.forEach((t) => {
    const div = document.createElement("div");
    div.className = "task" + (t.completed ? " completed" : "");
    div.innerHTML = `
      <span>${t.title} (${t.startDate.split("T")[0]} → ${
      t.endDate.split("T")[0]
    })</span>
      <button onclick="toggleTask('${t._id}', ${t.completed})">${
      t.completed ? "Desmarcar" : "Completar"
    }</button>
      <button onclick="deleteTask('${t._id}')">Eliminar</button>
    `;
    tasksDiv.appendChild(div);
    if (t.completed) completed++;
  });

  document.getElementById(
    "stats"
  ).innerText = `Completadas: ${completed} / ${tasks.length}`;
}

async function toggleTask(id, completed) {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ completed: !completed }),
  });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  loadTasks();
}

document.addEventListener("DOMContentLoaded", loadTasks);
