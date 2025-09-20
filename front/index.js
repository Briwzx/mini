const API_URL = "http://localhost:5000/api";

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("⚠️ Por favor completa todos los campos.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Inicio de sesión exitoso. Bienvenido/a " + data.user.name);
      // Guardamos token en localStorage para futuras peticiones
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      // Redirigir al dashboard de tareas
      window.location.href = "tareas.html";
    } else {
      alert("❌ " + (data.message || "Credenciales incorrectas"));
    }
  } catch (err) {
    console.error("Error:", err);
    alert("❌ Error de conexión con el servidor");
  }
}
