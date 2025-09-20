const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://TU-BACKEND-DEPLOY.vercel.app/api";

const token = localStorage.getItem("token");

if (!token) {
  alert("⚠️ Debes iniciar sesión primero.");
  window.location.href = "login.html";
}

let secondsElapsed = 0;
let timerInterval;

window.addEventListener("DOMContentLoaded", () => {
  startTimer();
  fetchProfile();
  fetchTasks();

  // Configurar botón de logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});

function startTimer() {
  const counterEl = document.getElementById("time-counter");
  timerInterval = setInterval(() => {
    secondsElapsed++;
    counterEl.textContent = formatTime(secondsElapsed);
  }, 1000);
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs > 0 ? hrs + "h " : ""}${mins > 0 ? mins + "m " : ""}${secs}s`;
}

async function fetchProfile() {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("No se pudo obtener el perfil");
    const user = await res.json();
    document.getElementById("profile-name").value = user.name;
    document.getElementById("profile-email").value = user.email;
  } catch (err) {
    console.error(err);
    alert("❌ Error al cargar el perfil");
  }
}

async function updateProfile() {
  const name = document.getElementById("profile-name").value.trim();
  const email = document.getElementById("profile-email").value.trim();

  if (!name || !email) {
    alert("⚠️ Completa todos los campos del perfil");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    });
    if (!res.ok) throw new Error("No se pudo actualizar el perfil");
    alert("✅ Perfil actualizado con éxito");
  } catch (err) {
    console.error(err);
    alert("❌ Error al actualizar el perfil");
  }
}

async function fetchTasks() {
  try {
    const res = await fetch(`${API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Error al obtener tareas");

    const tasks = await res.json();
    renderTasks(tasks);
    updateStats(tasks);
  } catch (err) {
    console.error("❌ Error en fetchTasks:", err.message);
    alert("❌ No se pudieron cargar las tareas.");
  }
}

async function addTask() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (!title || !startDate || !endDate) {
    alert("⚠️ Debes completar al menos título y fechas.");
    return;
  }

  const taskData = {
    title,
    description,
    startDate: new Date(startDate).toISOString(),
    endDate: new Date(endDate).toISOString(),
  };

  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  if (res.ok) {
    document.querySelector("form").reset();
    fetchTasks();
    alert("✅ Tarea agregada con éxito");
  } else {
    const err = await res.json();
    alert("❌ Error al agregar tarea: " + (err.error || err.message));
  }
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
  fetchTasks();
}

async function editTask(id, currentDescription, currentStart, currentEnd) {
  const newDescription = prompt("✏️ Edita la descripción:", currentDescription);
  if (newDescription === null) return;

  const newStart = prompt(
    "📅 Nueva fecha de inicio (YYYY-MM-DD):",
    currentStart.split("T")[0]
  );
  if (newStart === null) return;

  const newEnd = prompt(
    "📅 Nueva fecha de fin (YYYY-MM-DD):",
    currentEnd.split("T")[0]
  );
  if (newEnd === null) return;

  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      description: newDescription,
      startDate: new Date(newStart).toISOString(),
      endDate: new Date(newEnd).toISOString(),
    }),
  });

  if (res.ok) {
    alert("✅ Tarea actualizada");
    fetchTasks();
  } else {
    const err = await res.json();
    alert("❌ Error al actualizar tarea: " + (err.error || err.message));
  }
}

async function deleteTask(id) {
  if (!confirm("¿Seguro que deseas eliminar esta tarea?")) return;
  await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
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
      <button onclick="editTask('${t._id}', '${t.description || ""}', '${
      t.startDate
    }', '${t.endDate}')">✏️ Editar</button>
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
  window.location.href = "index.html";
}
