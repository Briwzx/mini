const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) {
  alert("⚠️ Debes iniciar sesión primero.");
  window.location.href = "login.html";
}

async function fetchTasks() {
  const res = await fetch(`${API_URL}/tasks`, {
    headers: { Authorization: token },
  });
  const tasks = await res.json();
  renderTasks(tasks);
  updateStats(tasks);
}

async function addTask() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ title, description, startDate, endDate }),
  });

  if (res.ok) {
    document.querySelector("form").reset();
    fetchTasks();
  } else {
    alert("❌ Error al agregar tarea");
  }
}

async function toggleTask(id, completed) {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ completed: !completed }),
  });
  fetchTasks();
}

async function deleteTask(id) {
  if (!confirm("¿Seguro que deseas eliminar esta tarea?")) return;
  await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: token },
  });
  fetchTasks();
}

function renderTasks(tasks) {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach((t) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${t.title}</strong> (${new Date(
      t.startDate
    ).toLocaleDateString()} - ${new Date(t.endDate).toLocaleDateString()})
      <br>${t.description || ""}
      <br>
      <button onclick="toggleTask('${t._id}', ${t.completed})">
        ${t.completed ? "✅ Completada" : "⬜ Pendiente"}
      </button>
      <button onclick="deleteTask('${t._id}')">🗑️ Eliminar</button>
    `;
    list.appendChild(li);
  });
}

function updateStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  document.getElementById(
    "stats"
  ).innerText = `Total: ${total} | Completadas: ${completed} | Pendientes: ${pending}`;
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// Inicializar
fetchTasks();
