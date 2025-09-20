const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

async function createTask() {
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

  console.log("📤 Enviando tarea al backend (dashboard):", taskData);

  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  if (res.ok) {
    alert("✅ Tarea agregada con éxito");
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    loadTasks();
  } else {
    const err = await res.json();
    console.error("❌ Error al agregar tarea:", err);
    alert("❌ Error al agregar tarea: " + (err.error || err.message));
  }
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
      <span>${t.title} (${new Date(
      t.startDate
    ).toLocaleDateString()} → ${new Date(
      t.endDate
    ).toLocaleDateString()})</span>
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
