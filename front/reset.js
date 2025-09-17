const API_URL = "http://localhost:5000/api";

async function resetPassword() {
  const email = document.getElementById("email").value;

  const res = await fetch(`${API_URL}/auth/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  alert(data.message || data.error);
}
