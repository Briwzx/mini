const API_URL = "http://localhost:5000/api";

async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (data.user) {
    alert("Registro exitoso, ahora inicia sesión.");
    window.location.href = "login.html";
  } else {
    alert(data.error || "Error al registrarse");
  }
}
