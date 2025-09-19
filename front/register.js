const API_URL = "http://localhost:5000/api";

async function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("⚠️ Completa todos los campos");
    return;
  }

  try {
    const res = await fetch(`${API_URL}./auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: name,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Registro exitoso, ahora inicia sesión");
      window.location.href = "index.html";
    } else {
      alert("⚠️ " + (data.message || "Error al registrarse"));
    }
  } catch (err) {
    alert("❌ Error al conectar con el servidor");
  }
}
